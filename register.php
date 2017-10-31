<?php
	// First, import DB configuration
	require_once('config.php');
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$name = "";
		$email = "";
		$password = "";
		$phone = "";
		$code = "";
		
		if (empty(trim($_POST["name"]))) {
			echo json_encode('MissingNameError');
		} else if (empty(trim($_POST["email"]))) {
			echo json_encode('MissingEmailError');
		} else if (empty(trim($_POST["password"]))) {
			echo json_encode('MissingPasswordError');
		} else if (empty(trim($_POST["phone"]))) {
			echo json_encode('MissingPhoneError');
		} else if (empty(trim($_POST["code"]))) {
			echo json_encode('MissingCodeError');
		} else {
			// No fields missing
			// Now, check if email already exists in system
			$sql = "SELECT _id FROM users WHERE email='".$email."';
			$result = $db_conn->query($sql);
			if ($row = $result->fetch()) {
				echo json_encode('AccountExistsError');
			} else {
				// Check access code
				$sql = "SELECT _id FROM codes WHERE code='".$code."';
				$result = $db_conn->query($sql);
				if ($row != $result->fetch()) {
					echo json_encode('InvalidCodeError');
				} else {
					// At this step, we have a valid access code and this is a unique email
					// Create account
					
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
		}
	}
	
?>
