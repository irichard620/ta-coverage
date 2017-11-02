<?php
	require_once "config.php";
	
	header("Content-Type: application/json");
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$email = (isset($_POST['email']) ? $_POST['email'] : null);
		$password = (isset($_POST['password']) ? $_POST['password'] : null);
		
		$error = False;
		
		if (empty($email)) {
			$error = True;
			echo json_encode(array('response' => 'MissingEmailError'));			
		} else if (empty($password)) {
			$error = True;
			echo json_encode(array('response' => 'MissingPasswordError'));
		} 
		
		if (!$error) {
			// No missing fields
			// Let's now check if account exists in system
			
			$sql = "SELECT _id, name, email, password, email, phone FROM users WHERE email=:email";
			$stmt = $db_conn->prepare($sql);
			$stmt->bindParam(':email', $email);
			if (!$stmt->execute()) {
				$error = True;
				echo json_encode(array('response' => 'DbError'));
			} else {
				$row = $stmt->fetch();
				if (!$row) {
					$error = True;
					echo json_encode(array('response' => 'AccountNotFoundError'));
				} else {
					// Validate password
					$hashed_password = $row['password'];
					if (password_verify($password, $hashed_password)) {
						echo json_encode(array('response' => 'Success'));
					} else {
						echo json_encode(array('response' => 'IncorrectPasswordError'));
					}
				}
			} 
		}
	}
?>
