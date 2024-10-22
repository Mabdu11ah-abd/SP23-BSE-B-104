$(document).ready(function () {
    // Bind the click event to the button
});
let usersList = [];
function GetUsersList() {
    $.ajax({
        url:"https://reqres.in/api/users",
        method:"GET",
        datatype:"JSON",
        success: function()
        {
            const totalPages = response.total_pages;
            // Fetch users from all pages
            for (let page = 1; page <= totalPages; page++) {
                $.ajax({
                    url: `https://reqres.in/api/users?page=${page}`,
                    type: 'GET',
                    success: function(response) {
                        users = users.concat(response.data); // Add users to the array
                        if (page === totalPages) {
                            console.log('All users:', users);
                            displayUsers(users); // Call function to display users on the page
                        }
                    }
                });
            }
        }
    });
}

function DisplayUsers()
{

}