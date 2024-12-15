$(document).ready(function()
{
    fetchProducts();
})
let queryParams = {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    sortOrder: "",
    page: 1,
  };
  // Search Form Submission
$("#search-form").on("submit", function (e) {
    e.preventDefault();
    queryParams.search = $(this).find("[name='search']").val();
    queryParams.page = 1; // Reset to the first page on new search
    fetchProducts();
  });
  
  // Filter Form Submission
  $("#filter-form").on("submit", function (e) {
    e.preventDefault();
    queryParams.category = $(this).find("[name='category']").val();
    queryParams.minPrice = $(this).find("[name='minPrice']").val();
    queryParams.maxPrice = $(this).find("[name='maxPrice']").val();
    queryParams.page = 1; // Reset to the first page on new filter
    fetchProducts();
  });
  
  // Sort Form Submission
  $("#sort-form").on("submit", function (e) {
    e.preventDefault();
    queryParams.sortBy = $(this).find("[name='sortBy']").val();
    queryParams.sortOrder = $(this).find("[name='sortOrder']").val();
    queryParams.page = 1; // Reset to the first page on new sort
    fetchProducts();
  });
  function fetchProducts() {
    console.log("method has been called");
    $.ajax({
      url: "/api/products",
      method: "GET",
      data: queryParams, // Send queryParams as the request data
      success: function (data) {
        renderProducts(data);
      },
      error: function (error) {
        console.error("Error fetching products:", error);
      },
    });

  }function renderProducts({ products, totalRecords, totalPages, page }) {
    queryParams.page = page; // Update the current page
    const tableBody = $("#product-table tbody");
    tableBody.empty();
  
    products.forEach((product) => {
      tableBody.append(`
        <tr>
          <td>${product._id}</td>
          <td>${product.title}</td>
          <td>${product.price}</td>
          <td>${product.description}</td>
          <td>
            <a href="/admin/products/edit/${product._id}" class="btn btn-warning">Edit</a>
            <a href="/admin/products/delete/${product._id}" class="btn btn-danger">Delete</a>
          </td>
        </tr>
      `);
    });
  
    renderPagination(totalPages, page);
  }
  
  function renderPagination(totalPages, currentPage) {
    const paginationDiv = $("#pagination");
    paginationDiv.empty();
  
    const prevDisabled = currentPage === 1 ? "disabled" : "";
    const nextDisabled = currentPage === totalPages ? "disabled" : "";
  
    let paginationHtml = `<ul class="pagination">`;
  
    // Previous button
    paginationHtml += `
      <li class="page-item ${prevDisabled}">
        <a href="#" class="page-link" data-page="${currentPage - 1}">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;
  
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? "active" : "";
      paginationHtml += `
        <li class="page-item ${activeClass}">
          <a href="#" class="page-link" data-page="${i}">${i}</a>
        </li>`;
    }
  
    // Next button
    paginationHtml += `
      <li class="page-item ${nextDisabled}">
        <a href="#" class="page-link" data-page="${currentPage + 1}">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
  
    paginationHtml += `</ul>`;
  
    paginationDiv.html(paginationHtml);
  }
  
  // Pagination Click Handler
  $("#pagination").on("click", ".page-link", function (e) {
    e.preventDefault();
    queryParams.page = $(this).data("page");
    fetchProducts();
  });