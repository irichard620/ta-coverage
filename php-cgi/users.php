<?php
	require_once "config.php";
	
	header("Content-Type: application/json");
	
	function getAllTas($db_conn) {
		$sql = "SELECT name, email, phone FROM users";
		$stmt = $db_conn->prepare($sql);
		if (!$stmt->execute()) {
			return array('response' => $stmt->errorInfo(), 'users' => '');
		} else {
			$allUsers = $stmt->fetchAll();
			foreach ($allUsers as &$user) {
				unset($user['0']);
				unset($user['1']);
				unset($user['2']);
			}
			return array('response' => 'Success', 'users' => $allUsers);
		}
	}
	
	if ($_SERVER["REQUEST_METHOD"] == "GET") { 
		$output = getAllTas($db_conn);
		echo json_encode($output);
	}
	
	$db_conn = NULL;
?>
