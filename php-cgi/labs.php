<?php
	require_once "config.php";

	header("Content-Type: application/json");

	function createLab($db_conn, $user_id) {
		$title = (isset($_POST['title']) ? $_POST['title'] : null);
		$labTime = (isset($_POST['labTime']) ? $_POST['labTime'] : null);
		$validThrough = (isset($_POST['validThrough']) ? $_POST['validThrough'] : null);

		if (empty($title)) {
			return array('response' => 'MissingTitleError', 'lab' => '');
		} else if (empty($labTime)) {
			return array('response' => 'MissingLabTimeError', 'lab' => '');
		} else if (empty($validThrough)) {
			return array('response' => 'MissingValidThroughError', 'lab' => '');
		}

		// First, generate random ID
		$_id = uniqid();

		// Next, generate search string
		$searchString = strtolower($title) . strtolower($labTime);

		// Now, create sql statement
		$sql = "INSERT INTO labs (_id, title, labTime, validThrough, searchString) VALUES (:_id, :title, :labTime, :validThrough, :searchString)";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':_id', $_id);
		$stmt->bindParam(':title', $title);
		$stmt->bindParam(':labTime', $labTime);
		$stmt->bindParam(':validThrough', $validThrough);
		$stmt->bindParam(':searchString', $searchString);
		if ($stmt->execute()) {
			$stmt->closeCursor();
			$createdLab = array('_id' => $_id, 'title' => $title, 'labTime' => $labTime, 'validThrough' => $validThrough);

			// Create relationship in management table
			$sql2 = "INSERT INTO userlabmanaging (user_id, lab_id) VALUES (:user_id, :lab_id)";
			$stmt2 = $db_conn->prepare($sql2);
			$stmt2->bindParam(':user_id', $user_id);
			$stmt2->bindParam(':lab_id', $_id);

			if ($stmt2->execute()) {
				return array('response' => 'Success', 'lab' => $createdLab);;
			} else {
				return array('response' => $stmt2->errorInfo(), 'lab' => '');
			}
		} else {
			return array('response' => 'DbError', 'lab' => '');
		}
	}

	function addQualifiedLab($db_conn, $user_id) {
		// Need to pass in lab_id
		$lab_id = (isset($_POST['lab_id']) ? $_POST['lab_id'] : null);

		if (empty($lab_id)) {
			return "MissingLabIdError";
		}

		$sql = "INSERT INTO userlabqualified (user_id, lab_id) VALUES (:user_id, :lab_id)";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':user_id', $user_id);
		$stmt->bindParam(':lab_id', $lab_id);
		if (!$stmt->execute()) {
			return $stmt->errorInfo();
		} else {
			return "Success";
		}
	}

	function getAllLabs($db_conn, $user_id) {
		// First, get all qualified labs from relationship
		$sql = "SELECT lab_id FROM userlabqualified WHERE user_id=:user_id";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':user_id', $user_id);
		if (!$stmt->execute()) {
			return array('response' => $stmt->errorInfo(), 'labs' => '');
		} else {
			// Get array of all lab IDs for this user
			$qualifiedLabs = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
			$stmt->closeCursor();

			// Now, get all labs
			$sql2 = "SELECT _id, title, labTime FROM labs";
			$stmt2 = $db_conn->prepare($sql2);
			if (!$stmt2->execute()) {
				return array('response' => $stmt2->errorInfo(), 'labs' => '');
			} else {
				// Fetch all
				$allLabs = $stmt2->fetchAll();
				foreach ($allLabs as &$lab) {
					foreach($qualifiedLabs as $lab_id) {
						if ($lab['_id'] == $lab_id) {
							$lab['qualified'] = True;
							break;
						} else {
							$lab['qualified'] = False;
						}
					}
					unset($lab['0']);
					unset($lab['1']);
					unset($lab['2']);
					unset($lab);
				}

				return array('response' => 'Success', 'labs' => $allLabs);

			}
		}
	}

	function getLabById($db_conn, $lab_id) {
		$sql = "SELECT _id, title, labTime FROM labs WHERE _id=:lab_id";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':user_id', $user_id);
		if (!$stmt->execute()) {
			return array('response' => $stmt->errorInfo(), 'lab' => '');
		} else {
			if ($row = $stmt->fetch()) {
				return array('response' => 'Success', 'lab' => $row);
			} else {
				return array('response' => 'NoLabExistsError', 'lab' => '');
			}
	}

	function getQualifiedLabs($db_conn, $user_id) {
		$sql = "SELECT labs._id, labs.title, labs.labTime FROM userlabqualified INNER JOIN labs ON labs._id=userlabqualified.lab_id WHERE userlabqualified.user_id=:user_id ";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':user_id', $user_id);
		if (!$stmt->execute()) {
			return array('response' => $stmt->errorInfo(), 'labs' => '');
		} else {
			$allLabs = $stmt->fetchAll();
			foreach ($allLabs as &$lab) {
				unset($lab['0']);
				unset($lab['1']);
				unset($lab['2']);
			}
			unset($lab);
			return array('response' => 'Success', 'labs' => $allLabs);
		}
	}

	function getManagedLabs($db_conn, $user_id) {
		$sql = "SELECT labs._id, labs.title, labs.labTime FROM userlabmanaging INNER JOIN labs ON labs._id=userlabmanaging.lab_id WHERE userlabmanaging.user_id=:user_id ";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':user_id', $user_id);
		if (!$stmt->execute()) {
			return array('response' => $stmt->errorInfo(), 'labs' => '');
		} else {
			$allLabs = $stmt->fetchAll();
			foreach ($allLabs as &$lab) {
				unset($lab['0']);
				unset($lab['1']);
				unset($lab['2']);
			}
			unset($lab);
			return array('response' => 'Success', 'labs' => $allLabs);
		}
	}

	function removeQualifiedLab($db_conn, $user_id, $lab_id) {
		$sql = "DELETE FROM userlabqualified WHERE user_id=:user_id AND lab_id=:lab_id";
		$stmt = $db_conn->prepare($sql);
		$stmt->bindParam(':user_id', $user_id);
		$stmt->bindParam(':lab_id', $lab_id);
		if (!$stmt->execute()) {
			return "DbError";
		} else {
			return "Success";
		}
	}

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		// Get type, user_id
		$type = (isset($_POST['type']) ? $_POST['type'] : null);
		$user_id = (isset($_POST['user_id']) ? $_POST['user_id'] : null);

		if (empty($type)) {
			echo json_encode(array('response' => 'MissingTypeError'));
		} else if (empty($user_id)) {
			echo json_encode(array('response' => 'MissingUserIdError'));
		} else {
			if ($type == "create") {
				$output = createLab($db_conn, $user_id);
				echo json_encode($output);
			} else if ($type == "edit") {
				$output = addQualifiedLab($db_conn, $user_id);
				echo json_encode(array('response' => $output));
			}
		}
	} else if ($_SERVER["REQUEST_METHOD"] == "GET") {
		// Get all labs, mark if they are already qualified for this user
		$user_id = (isset($_GET['user_id']) ? $_GET['user_id'] : null);
		$type = (isset($_GET['type']) ? $_GET['type'] : null);

		if (empty($user_id)) {
			echo json_encode(array('response' => 'MissingUserIdError'));
		} else if (empty($type)) {
			echo json_encode(array('response' => 'MissingTypeError'));
		} else {
			if ($type == "all") {
				$output = getAllLabs($db_conn, $user_id);
				echo json_encode($output);
			} else if ($type == "qualified") {
				$output = getQualifiedLabs($db_conn, $user_id);
				echo json_encode($output);
			} else if ($type == "managed") {
				$output = getManagedLabs($db_conn, $user_id);
				echo json_encode($output);
			} else if ($type == "byId") {
				$lab_id = (isset($_GET['lab_id']) ? $_GET['lab_id'] : null);
				if (empty($lab_id)) {
					echo json_encode(array('response' => 'MissingLabIdError'));
				}
				$output = getLabById($db_conn, $lab_id);
				echo json_encode($output);
			}
		}

	} else if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
		parse_str(file_get_contents('php://input'), $_DELETE);

		// Remove relationship to lab
		$user_id = (isset($_DELETE['user_id']) ? $_DELETE['user_id'] : null);

		$lab_id = (isset($_DELETE['lab_id']) ? $_DELETE['lab_id'] : null);

		if (empty($user_id)) {
			echo json_encode(array('response' => 'MissingUserIdError'));
		} else if (empty($lab_id)) {
			echo json_encode(array('response' => 'MissingLabIdError'));
		} else {
			$output = removeQualifiedLab($db_conn, $user_id, $lab_id);
			echo json_encode(array('response' => $output));
		}
	}

	$db_conn = NULL;
?>
