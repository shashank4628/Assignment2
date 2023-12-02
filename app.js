const searchInput = document.getElementById('searchInput');
  const apiUrl = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  let members = [];
  let currentPage = 1;
  const rowsPerPage = 10;
  let filteredMembers = [];

  async function fetchData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    members = data;
    renderTable();
    renderPagination();
  }

  function renderTable() {
    const tableBody = document.querySelector("#memberTable tbody");
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const currentMembers = filteredMembers.length > 0 ? filteredMembers.slice(start, end) : members.slice(start, end);

    currentMembers.forEach(member => {
      const row = tableBody.insertRow();
      const checkboxCell = row.insertCell(0);
      const nameCell = row.insertCell(1);
      const emailCell = row.insertCell(2);
      const roleCell = row.insertCell(3);
      const actionCell = row.insertCell(4);

      checkboxCell.innerHTML = `<input type="checkbox">`;
      nameCell.textContent = member.name;
      emailCell.textContent = member.email;
      roleCell.textContent = member.role;

      const editButton = document.createElement("button");
      editButton.innerHTML = `<img src="/images/edit.png" height="20px" width="20px"/>`
      editButton.className = "edit-icon";
      editButton.onclick = () => editMember(member.id);
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `<img src="/images/delete.png" height="20px" width="20px"/>`
      deleteButton.className = "delete-icon";
      deleteButton.onclick = () => deleteMember(member.id);

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
    });
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredMembers.length > 0 ? filteredMembers.length / rowsPerPage : members.length / rowsPerPage);
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = "";

    const firstPageButton = createPaginationButton("First", 1);
    const prevPageButton = createPaginationButton("Previous", currentPage - 1);
    paginationElement.appendChild(firstPageButton);
    paginationElement.appendChild(prevPageButton);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = createPaginationButton(i, i);
      paginationElement.appendChild(pageButton);
    }

    const nextPageButton = createPaginationButton("Next", currentPage + 1);
    const lastPageButton = createPaginationButton("Last", totalPages);
    paginationElement.appendChild(nextPageButton);
    paginationElement.appendChild(lastPageButton);
  }

  function createPaginationButton(text, page) {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = () => goToPage(page);
    return button;
  }

  function goToPage(page) {
    if (page >= 1 && page <= Math.ceil(filteredMembers.length > 0 ? filteredMembers.length / rowsPerPage : members.length / rowsPerPage)) {
      currentPage = page;
      renderTable();
      renderPagination();
    }
  }

  function toggleSelectAll() {
    const checkboxes = document.querySelectorAll("#memberTable tbody input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = document.getElementById("selectAll").checked);
  }

  function clearSearch() {
    const tableBody = document.querySelector("#memberTable tbody");
    tableBody.innerHTML = "";

  }

  function searchMembers() {
    const searchValue = searchInput.value.toLowerCase();
    filteredMembers = members.filter(member => {
        return member.name.toLowerCase().includes(searchValue) || member.email.toLowerCase().includes(searchValue)
    });
    currentPage = 1;
    renderTable();
    renderPagination();
  }

function editMember(memberId) {
  const index = members.findIndex(member => member.id === memberId);

  if (index !== -1) {
    const newName = prompt("Enter the new name:", members[index].name);
    const newEmail = prompt("Enter the new email:", members[index].email);
    const newRole = prompt("Enter the new role:", members[index].role);
    members[index].name = newName;
    members[index].email = newEmail;
    members[index].role = newRole;
    renderTable();
    console.log(`Edited member with ID ${memberId}`);
  } else {
    console.log(`Member with ID ${memberId} not found`);
  }
}

function deleteMember(memberId) {
  const index = members.findIndex(member => member.id === memberId);

  if (index !== -1) {
    members.splice(index, 1);

    renderTable();
    renderPagination();

    console.log(`Deleted member with ID ${memberId}`);
  } else {
    console.log(`Member with ID ${memberId} not found`);
  }
}

  fetchData();
  searchInput.addEventListener('input', searchMembers);