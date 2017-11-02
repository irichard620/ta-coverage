<?php
	// First, import DB configuration
	require_once('config.php');
	
	header("Content-Type: application/json");
	
	function register($db_conn) {
		$name = (isset($_GET['name']) ? $_GET['name'] : null);
		$email = (isset($_GET['email']) ? $_GET['email'] : null);
		$password = (isset($_GET['password']) ? $_GET['password'] : null);
		$phone = (isset($_GET['phone']) ? $_GET['phone'] : null);
		$code = (isset($_GET['code']) ? $_GET['code'] : null);
		
		if (empty($name)) {
			return array('response' => 'MissingNameError', 'user' => '');
		} else if (empty($email)) {
			return array('response' => 'MissingEmailError', 'user' => '');
		} else if (empty($password)) {
			return array('response' => 'MissingPasswordError', 'user' => '');
		} else if (empty($phone)) {
			return array('response' => 'MissingPhoneError', 'user' => '');
		} else if (empty($code)) {
			return array('response' => 'MissingCodeError', 'user' => '');
		} 
		
		// No fields missing
		// Now, check if email already exists in system
		$sql = "SELECT _id FROM users WHERE email=:email";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':email', $email);
		if (!$stmt->execute()) {
			return array('response' => 'DbError', 'user' => '');
		} else {
			if ($row = $stmt->fetch()) {
				return array('response' => 'AccountExistsError', 'user' => '');
			} 
		}
		
		
		// Unique account
		// Now check access code
		$sql = "SELECT _id FROM codes WHERE code=:code";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':code', $code);
		if (!$stmt->execute()) {
			return array('response' => 'DbError', 'user' => '');
		} else {
			if (!($row = $stmt->fetch())) {
				return array('response' => 'InvalidCodeError', 'user' => '');
			} 
		}
		
		
		// We now have a unique account and valid access code
		// Let's go ahead and create the account
		
		// First, generate random ID
		$_id = uniqid();
				
		// Now, create sql statement
		$sql = "INSERT INTO users (_id, name, email, phone, code, password) VALUES (:_id, :name, :email, :phone, :code, :password)";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':_id', $_id);
		$stmt->bindParam(':name', $name);
		$stmt->bindParam(':email', $email);
		$stmt->bindParam(':phone', $phone);
		$stmt->bindParam(':code', $code);
		$hashed_password = password_hash($password, PASSWORD_BCRYPT);
		$stmt->bindParam(':password', $hashed_password);
			
		$createdUser = array('_id' => $_id, 'name' => $name, 'email' => $email, 'phone' => $phone);
					
		if ($stmt->execute()) {
			return array('response' => 'Success', 'user' => $createdUser);
		} else {
			return array('response' => 'DbError', 'user' => '');
		}			
	}
	
	if ($_SERVER["REQUEST_METHOD"] == "GET") {
		$output = register($db_conn);
		$db_conn = NULL;
		echo json_encode($output);
	}
?>
