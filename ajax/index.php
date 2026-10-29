
<!DOCTYPE html>
<html>
<head>
    <title>AJAX Student Data</title>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <style>
        table {
            border-collapse: collapse;
            width: 70%;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid black;
            padding: 10px;
        }

        th {
            background: #ddd;
        }

        button {
            padding: 10px 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>

    <h2>Student Information</h2>
    <button onclick="loadStudents()">Load Students</button>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Mobile</th>
            </tr>
        </thead>

        <tbody id="studentData">
            <tr>
                <td colspan="4">Click the button to load data</td>
            </tr>
        </tbody>
    </table>

    <script>
        function loadStudents() {
            $.ajax({
                url: "fetch_student.php",
                type: "GET",
                dataType: "json",

                success: function(data) {
                    let output = "";

                    if (data.length === 0) {
                        output = "<tr><td colspan='4'>No students found</td></tr>";
                    } else {
                        $.each(data, function(index, student) {
                            output += `
                                <tr>
                                    <td>${student.id}</td>
                                    <td>${student.name}</td>
                                    <td>${student.course}</td>
                                    <td>${student.mobile}</td>
                                </tr>
                            `;
                        });
                    }

                    $("#studentData").html(output);
                },

                error: function(xhr) {
                    console.log(xhr.responseText);
                    $("#studentData").html(
                        "<tr><td colspan='4'>Error fetching data</td></tr>"
                    );
                }
            });
        }
    </script>

</body>
</html>
