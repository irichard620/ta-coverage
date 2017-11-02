<?php
	require_once "config.php";
	
	header("Content-Type: application/json");
	
	function login($db_conn) {
		$email = (isset($_GET['email']) ? $_GET['email'] : null);
		$password = (isset($_GET['password']) ? $_GET['password'] : null);
		
		if (empty($email)) {
			return array('response' => 'MissingEmailError','user' => '');			
		} else if (empty($password)) {
			return array('response' => 'MissingPasswordError','user' => '');
		} 
		
		$sql = "SELECT _id, name, email, password, email, phone FROM users WHERE email=:email";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':email', $email);
		if (!$stmt->execute()) {
			return array('response' => 'DbError','user' => '');
		} else {
			$row = $stmt->fetch();
			if (!$row) {
				return array('response' => 'AccountNotFoundError','user' => '');
			} else {
				// Validate password
				$hashed_password = $row['password'];
				if (password_verify($password, $hashed_password)) {
					$loggedInUser = array('_id' => $row['_id'], 'name' => $row['name'], 'email' => $row['email'], 'phone' => $row['phone']);
					return array('response' => 'Success', 'user' => $loggedInUser);
				} else {
					return array('response' => 'IncorrectPasswordError','user' => '');
				}
			}
		}
	}
	
	if ($_SERVER["REQUEST_METHOD"] == "GET") {
		$output = login($db_conn);
		echo json_encode($output);
	}
	$db_conn = NULL;
?>
