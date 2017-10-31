<?php
	require_once "config.php";
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$email = trim($_POST["email"]);
		$password = trim($_POST["password"]);
		
		$error = False;
		
		if (empty($email)) {
			$error = True;
			echo json_encode('MissingEmailError');
		} else if (empty($password)) {
			$error = True;
			echo json_encode('MissingPasswordError');
		} 
		
		if (!$error) {
			// No missing fields
			// Let's now check if account exists in system
			
			$sql = "SELECT _id, name, email, password, email, phone FROM users WHERE email=?";
			$stmt = $db_conn->prepare($sql);
			$stmt->bindParam("s", $email);
			if (!$stmt->execute()) {
				$error = True;
				echo json_encode('DbError');
			} else {
				$result = $stmt->get_result();
				$row = $result->fetch();
				if (!$row) {
					$error = True;
					echo json_encode('AccountNotFoundError');
				} else {
					// Validate password
					
				}
			} 
		}
	}
?>
