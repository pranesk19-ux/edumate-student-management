const app = angular.module("studentApp", []);

app.controller("StudentController", function ($scope, $http, $timeout) {

    const API = "/api/students";

    // =========================
    // LOGIN / USER
    // =========================

    $scope.loggedUser = JSON.parse(
        localStorage.getItem("studentHubUser") || "{}"
    );

    // =========================
    // LOGOUT
    // =========================

    $scope.logout = function () {

        localStorage.removeItem("studentHubToken");
        localStorage.removeItem("studentHubUser");

        window.location.href = "login.html";
    };

    // =========================
    // AUTH CONFIG
    // =========================

    function authConfig() {

        const currentToken =
            localStorage.getItem("studentHubToken");

        return {
            headers: {
                Authorization: "Bearer " + currentToken
            }
        };
    }

    // =========================
    // BASIC DATA
    // =========================

    $scope.departments = [
        "Computer Science",
        "Information Technology",
        "Commerce",
        "Physics",
        "Mathematics",
        "English"
    ];

    $scope.students = [];

    $scope.searchText = "";
    $scope.selectedDepartment = "";
    $scope.selectedYear = "";
    $scope.selectedStatus = "";

    $scope.formData = {};

    $scope.editingStudent = false;
    $scope.saving = false;
    $scope.apiOnline = false;

    $scope.selectedStudent = null;

    $scope.toastMessage = "";

    // =========================
    // NOTIFICATION
    // =========================

    function notify(message) {

        $scope.toastMessage = message;

        const toastElement =
            document.getElementById("toastMessage");

        if (toastElement) {

            const toast =
                bootstrap.Toast.getOrCreateInstance(
                    toastElement
                );

            toast.show();
        }
    }

    // =========================
    // DATE FUNCTIONS
    // =========================

    $scope.formatDisplayDate = function (date) {

        if (!date) {
            return "";
        }

        const d = new Date(date);

        if (isNaN(d.getTime())) {
            return "";
        }

        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    $scope.formatDate = function (date) {

        if (!date) {
            return "Not provided";
        }

        const d = new Date(date);

        if (isNaN(d.getTime())) {
            return "Not provided";
        }

        return d.toLocaleDateString("en-IN");
    };

    // =========================
    // FILTER
    // =========================

    $scope.filteredStudents = function () {

        const search =
            ($scope.searchText || "")
                .toLowerCase()
                .trim();

        return $scope.students.filter(function (student) {

            const matchesSearch =
                !search ||
                String(student.name || "")
                    .toLowerCase()
                    .includes(search) ||
                String(student.studentId || "")
                    .toLowerCase()
                    .includes(search) ||
                String(student.email || "")
                    .toLowerCase()
                    .includes(search) ||
                String(student.phone || "")
                    .toLowerCase()
                    .includes(search);

            const matchesDepartment =
                !$scope.selectedDepartment ||
                student.department ===
                $scope.selectedDepartment;

            const matchesYear =
                !$scope.selectedYear ||
                String(student.year) ===
                String($scope.selectedYear);

            const matchesStatus =
                !$scope.selectedStatus ||
                student.status ===
                $scope.selectedStatus;

            return (
                matchesSearch &&
                matchesDepartment &&
                matchesYear &&
                matchesStatus
            );
        });
    };

    // =========================
    // RESET FILTERS
    // =========================

    $scope.resetFilters = function () {

        $scope.searchText = "";
        $scope.selectedDepartment = "";
        $scope.selectedYear = "";
        $scope.selectedStatus = "";
    };

    // =========================
    // PREPARE ADD STUDENT
    // =========================

    $scope.prepareAdd = function () {

        $scope.editingStudent = false;

        $scope.saving = false;

        $scope.formData = {

            studentId:
                "STU-" +
                (1000 + $scope.students.length + 1),

            name: "",
            email: "",
            phone: "",
            department: "",
            year: "",
            gender: "",
            dateOfBirth: null,
            address: "",
            status: "Active"
        };
    };

    // =========================
    // EDIT STUDENT
    // =========================

    $scope.editStudent = function (student) {

        $scope.editingStudent = true;

        $scope.saving = false;

        $scope.formData =
            angular.copy(student);

        if ($scope.formData.dateOfBirth) {

            const date =
                new Date($scope.formData.dateOfBirth);

            if (!isNaN(date.getTime())) {

                $scope.formData.dateOfBirth = date;
            }
        }
    };

    // =========================
    // VIEW STUDENT
    // =========================

    $scope.viewStudent = function (student) {

        $scope.selectedStudent =
            angular.copy(student);
    };

    // =========================
    // SAVE STUDENT
    // =========================

    $scope.saveStudent = function () {

        const form =
            $scope.studentForm;

        if (form && form.$invalid) {

            form.$setSubmitted();

            notify(
                "Please complete all required fields correctly."
            );

            return;
        }

        $scope.saving = true;

        const payload =
            angular.copy($scope.formData);

        payload.year =
            Number(payload.year);

        if (payload.dateOfBirth) {

            const dob =
                new Date(payload.dateOfBirth);

            if (!isNaN(dob.getTime())) {

                payload.dateOfBirth =
                    dob.toISOString();
            }
        }

        // =========================
        // ADD STUDENT
        // =========================

        if (!$scope.editingStudent) {

            $http.post(
                API,
                payload,
                authConfig()
            )

            .then(function (response) {

                $scope.students.unshift(
                    response.data
                );

                $scope.saving = false;

                notify(
                    "Student registered successfully."
                );

                closeStudentModal();

            })

            .catch(function (error) {

                $scope.saving = false;

                if (error.status === 401) {

                    $scope.logout();
                    return;
                }

                console.error(
                    "Save student error:",
                    error
                );

                notify(
                    error.data &&
                    error.data.message
                        ? error.data.message
                        : "Unable to save student."
                );
            });

            return;
        }

        // =========================
        // UPDATE STUDENT
        // =========================

        $http.put(
            API + "/" + payload._id,
            payload,
            authConfig()
        )

        .then(function (response) {

            const index =
                $scope.students.findIndex(
                    function (student) {

                        return student._id ===
                            response.data._id;
                    }
                );

            if (index !== -1) {

                $scope.students[index] =
                    response.data;
            }

            $scope.saving = false;

            notify(
                "Student updated successfully."
            );

            closeStudentModal();

        })

        .catch(function (error) {

            $scope.saving = false;

            if (error.status === 401) {

                $scope.logout();
                return;
            }

            console.error(
                "Update student error:",
                error
            );

            notify(
                error.data &&
                error.data.message
                    ? error.data.message
                    : "Unable to update student."
            );
        });
    };

    // =========================
    // CLOSE STUDENT MODAL
    // =========================

    function closeStudentModal() {

        const modalElement =
            document.getElementById("studentModal");

        if (modalElement) {

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );

            if (modal) {
                modal.hide();
            }
        }
    }

    // =========================
    // DELETE STUDENT
    // =========================

    $scope.deleteStudent = function (student) {

        if (
            !confirm(
                "Delete " +
                student.name +
                "? This action cannot be undone."
            )
        ) {
            return;
        }

        $http.delete(
            API + "/" + student._id,
            authConfig()
        )

        .then(function () {

            $scope.students =
                $scope.students.filter(
                    function (item) {

                        return item._id !==
                            student._id;
                    }
                );

            notify(
                "Student deleted successfully."
            );
        })

        .catch(function (error) {

            if (error.status === 401) {

                $scope.logout();
                return;
            }

            console.error(
                "Delete student error:",
                error
            );

            notify(
                "Unable to delete student."
            );
        });
    };

    // =========================
    // LOAD STUDENTS FROM ATLAS
    // =========================

    function loadStudents() {

        const token =
            localStorage.getItem("studentHubToken");

        if (!token) {

            window.location.href =
                "login.html";

            return;
        }

        $http.get(
            API,
            authConfig()
        )

        .then(function (response) {

            $scope.students =
                response.data;

            $scope.apiOnline = true;

            console.log(
                "Students loaded from MongoDB Atlas:",
                $scope.students
            );
        })

        .catch(function (error) {

            console.error(
                "Unable to load students:",
                error
            );

            if (error.status === 401) {

                $scope.logout();
                return;
            }

            $scope.apiOnline = false;

            notify(
                "Unable to connect to the student database."
            );
        });
    }

    // =========================
    // START
    // =========================

    loadStudents();

});