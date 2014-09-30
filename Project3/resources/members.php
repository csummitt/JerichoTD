<?php
	session_start();
//This is the member page for lab3 in the course CSCI N342
//Created by: Christopher Summitt 	Date: 9/18/2014
/*This site is created to test and use Session variables and arrays
**The site will take user input in the for of a new member and add it
**to an array. Currently there is no removing function so this way works
**but to remove the code would need to be modified
*/

	require_once "inc/util.php"

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="EN" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
	<head>
	<title>Lab 3 Members </title>
	<style type = "text/css">
  		h1, h2 {
    		text-align: center;
  		}
		table, th, td {
			border: 1px solid black;
			border-collapse: collapse;
		}
		th {
			text-align: center;
		}
	</style>

	</head>

	<body>
		<?php
			//Variable initialization
			$fn = "";
			$fnValid = false;
			$ln = "";
			$lnValid = false;
			$em = "";
			$emValid = false;
			$tele = "";
			$teleValid = false;
			$fnError = "";
			$lnError = "";
			$emError = "";
			$teleError = "";
			$memberarray = array(
						array("test","test","test","test"),
						array("tset","tset","tset","tset"),
						array("t1st","test","test","test"),
						array("t2et","tset","tset","tset"),
						array("t3st","test","test","test")
						);
			
			$msg = "You may enter 5 new members into the table";
			//Check to see if the count varialbe is set, if not set one
			if(!isset($_SESSION['count'])){
				$_SESSION['count'] = 0;
			}
			
			//Used to stop the session and log the user out
			if( isset($_POST['logout'])){
				session_destroy();
				Header ("Location:login.php");
				exit();
			}
			
			//This is what happens when the user clicks the add button
			if( isset($_POST['enter'])){
				//Grab each field
				$fn = trim($_POST['firstname']);
				$ln = trim($_POST['lastname']);
				$em = trim($_POST['email']);
				$tele = trim($_POST['telephone']);
				
				
				//Tell the user how many members they have to go
				$msg = 'You may enter upto '.(5-$_SESSION['count']).' more members!<br />';
				
				//Check first name
				if($fn == "")
				{
					$fnValid = false;
					$fnError = '<span style = "color:red">*</span>';
				} else {
					$fnError = "";
					$fnValid = true;
				}
				//Check Last name
				if($ln == "")
				{
					$lnValid = false;
					$lnError = '<span style = "color:red">*</span>';
				} else {
					$lnValid = true;
					$lnError = "";
				}
				
				//Check email spam and verify
				$em = filter_var($em, FILTER_SANITIZE_EMAIL);
				if(filter_var($em, FILTER_VALIDATE_EMAIL))
				{
					$emValid = true;
					$emError = "";
				} else {
					$emValid = false;
					$emError = '<span style = "color:red">*</span>';
				}
				//A custom function in the util.php to format number returns false if number doesn't fit any of the pre-sets
				$tele = formatPhoneNumber($tele) ;
				if( $tele != false)
				{
					$teleError = "";
					$teleValid = true;
				} else {
					$teleError = '<span style = "color:red">*</span>';
					$teleValid = false;
				}
				//If all fields were valid then we need to add it to the Session variable
				if ($fnValid && $lnValid && $emValid && $teleValid) 
				{
					//Make sure they haven't reached there limit
					if($_SESSION['count'] < 5)
					{
						//If this is the first time we are adding to the session we need to create the variable
						if(!isset($_SESSION['member']))
						{
							$_SESSION['member'] = $memberarray;
						}
						//Add info to session
						$_SESSION['member'][$_SESSION['count']][0] = $fn;
						$_SESSION['member'][$_SESSION['count']][1] = $ln;
						$_SESSION['member'][$_SESSION['count']][2] = $em;
						$_SESSION['member'][$_SESSION['count']][3] = $tele;
						$_SESSION['count'] = $_SESSION['count'] + 1;
						//Update msg
						$msg = 'You may enter upto '.(5-$_SESSION['count']).' more members!<br />';
					} else {
						//Tell the user they have reached their limit
						$msg = '<span style = "color:red">You have submited your 5 members!</span>';
					}
				}
				
			}
		
		?>
		<form action="members.php" method="post">
			<h1> Members</h2>
			<?php print $msg ?>
			<table style="width:50%">
				<caption>Member Info</caption>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
					<th>Phone Number</th>
				</tr>
				<?php
					//Setup the loop condition variable
					if(isset($_SESSION['count'])){
						$loopCount = $_SESSION['count'];
					} else {
						$loopCount = 0;
					}
					//For every added member we need to add it to the table
					for ($i=0; $i < $loopCount; $i++)
					{
						if (isset($_SESSION['member'])){
							$memberUse = $_SESSION['member'][$i];
							print '<tr><td>'.$memberUse[0].'</td><td>'.$memberUse[1].'</td><td>'.$memberUse[2].'</td><td>'.$memberUse[3].'</td></tr>';
						}
					}
				?>
			</table>
			
			<br /><br /><br /><br />
			<!--Standard HTML input form in the table format. -->
			<table style="width:50%">
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
					<th>Phone Number</th>
				</tr>
				<tr>
					<td>
						<?php print $fnError; ?> 
						<input type="text" maxlength = "50" value="" name="firstname" id="firstname"   /> 
					</td>
					<td>
						<?php print $lnError; ?>
						<input type="text" maxlength = "50" value="" name="lastname" id="lastname"   />
					</td>
					<td>
						<?php print $emError; ?>
						<input type="email" maxlength = "50" value="" name="email" id="email"   />
					</td>
					<td>
						<?php print $teleError; ?>
						<input type="tel" maxlength = "10" value="" name="telephone" id="telephone"   /><br />
					</td>
					<td>
						<input name="enter" class="btn" type="submit" value="Add" />
					</td>
				</tr>
			</table>
			
			<br /><br /><br /><br />
			
			<input name="logout" class="btn" type="submit" value="logout" ?>
			
		</form>


	</body>
</html>