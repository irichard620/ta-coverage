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

	function getQualifiedTAs($db_conn, $lab_id) {
		$sql = "SELECT users._id, users.name, users.email, users.phone FROM userlabqualified INNER JOIN users ON users._id=userlabqualified.user_id WHERE userlabqualified.lab_id=:lab_id";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':lab_id', $lab_id);
		if (!$stmt->execute()) {
			return array('response' => $stmt->errorInfo(), 'users' => '');
		} else {
			$allUsers = $stmt->fetchAll();
			return array('response' => 'Success', 'users' => $allUsers);
		}
	}

	function editUser($db_conn, $_id, $_PUT) {
		$name = (isset($_PUT['name']) ? $_PUT['name'] : null);
		$phone = (isset($_PUT['phone']) ? $_PUT['phone'] : null);

		if (empty($name)) {
			echo json_encode(array('response' => 'MissingNameError'));
		} else if (empty($phone)) {
			echo json_encode(array('response' => 'MissingPhoneError'));
		} else {
			// All data present, edit
			$sql = "UPDATE users SET name=:name, phone=:phone WHERE _id=:_id";
			$stmt = $db_conn->prepare($sql);
			$stmt->bindParam(':name', $name);
			$stmt->bindParam(':phone', $phone);
			$stmt->bindParam(':_id', $_id);
			if (!$stmt->execute()) {
				return array('response' => $stmt->errorInfo());
			} else {
				return array('response' => 'Success');
			}
		}
	}

	if ($_SERVER["REQUEST_METHOD"] == "GET") {
		$type = (isset($_GET['type']) ? $_GET['type'] : null);

		if (empty($type)) {
			echo json_encode(array('response' => 'MissingTypeError'));
		} else {
			if ($type == "all") {
				$output = getAllTas($db_conn);
				echo json_encode($output);
			} else if ($type == "qualified") {
				$lab_id = (isset($_GET['lab_id']) ? $_GET['lab_id'] : null);
				if (empty($lab_id)) {
					echo json_encode(array('response' => 'MissingLabIdError'));
				}
				$output = getQualifiedTAs($db_conn, $lab_id);
				echo json_encode($output);
			}
		}
	} else if ($_SERVER["REQUEST_METHOD"] == "PUT") {
		// Get input vars
		parse_str(file_get_contents('php://input'), $_PUT);

		// Grab user and lab ID
		$_id = (isset($_PUT['_id']) ? $_PUT['_id'] : null);

		if (empty($_id)) {
			echo json_encode(array('response' => 'MissingUserIdError'));
		} else {
			$output = editUser($db_conn, $_id, $_PUT);
			echo json_encode($output);
		}
	}

	$db_conn = NULL;
?>
