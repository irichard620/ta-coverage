<?php
	// First, import DB configuration
	require_once('config.php');
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$name = trim($_POST["name"]);
		$email = trim($_POST["email"]);
		$password = trim($_POST["password"]);
		$phone = trim($_POST["phone"]);
		$code = trim($_POST["code"]);
		
		$error = False;
		
		if (empty($name)) {
			$error = True;
			echo json_encode('MissingNameError');
		} else if (empty($email)) {
			$error = True;
			echo json_encode('MissingEmailError');
		} else if (empty($password)) {
			$error = True;
			echo json_encode('MissingPasswordError');
		} else if (empty($phone)) {
			$error = True;
			echo json_encode('MissingPhoneError');
		} else if (empty($code)) {
			$error = True;
			echo json_encode('MissingCodeError');
		} 
		
		if (!$error) {
			// No fields missing
			// Now, check if email already exists in system
			$sql = "SELECT _id FROM users WHERE email=?;
			$stmt = $db_conn->prepare($sql);
			$stmt->bindParam("s", $email);
			if (!$stmt->execute()) {
				$error = True;
				echo json_encode('DbError');
			} else {
				$result = $stmt->get_result();
				if ($row = $result->fetch()) {
					$error = True;
					echo json_encode('AccountExistsError');
				} 
			}
		}
		
		if (!$error) {
			// Unique account
			// Now check access code
			$sql = "SELECT _id FROM codes WHERE code=?;
			$stmt = $db_conn->prepare($sql);
			$stmt->bindParam("s", $code);
			if (!$stmt->execute()) {
				$error = True;
				echo json_encode('DbError');
			} else {
				$result = $stmt->get_result();
				if (!($row = $result->fetch())) {
					$error = True;
					echo json_encode('InvalidCodeError');
				} 
			}
		}
		
		if (!$error) {
			// We now have a unique account and valid access code
			// Let's go ahead and create the account
			
			// First, generate random ID
			$_id = uniqid();
				
			// Now, create sql statement
			$sql = "INSERT INTO users (_id, name, email, phone, code, password) VALUES (:_id, :name, :email, :phone, :code, :password);
			$stmt = $db_conn->prepare($sql);
			$stmt->bindParam(':_id', $_id);
			$stmt->bindParam(':name', $name);
			$stmt->bindParam(':email', $email);
			$stmt->bindParam(':phone', $phone);
			$stmt->bindParam(':code', $code);
			$stmt->bindParam(':password', password_hash($password));
					
			if ($stmt->execute()) {
				echo json_encode('Success');
			} else {
				echo json_encode('DbError');
			}
			
		}
	}
?>
