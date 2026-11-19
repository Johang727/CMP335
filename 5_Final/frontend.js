const server_url = "http://127.0.0.1:3002"; // 3000 is used by VSC live server;

/* Called on page load and modified on updates */
async function prep_table() {
  const students_list = document.getElementById("students-list");

  // show the spinner again & empty out the previous table
  students_list.innerHTML = `<div class="spinner-border" role="status" id="students-spinner">`;

  // table creation
  const new_table = document.createElement("table");
  const header_row = document.createElement("tr");

  // make the header row
  const student_attrs = ["#", "Last Name", "First Name", "Email Address", "Options"];

  for (const attr of student_attrs) {
    const new_cell = document.createElement("th");
    // create text node handles sanitation
    new_cell.appendChild(document.createTextNode(attr));
    header_row.appendChild(new_cell);
  }

  new_table.appendChild(header_row); // add header row

  /* For POST Operation */
  const add_row = document.createElement("tr");
  const id_cell = document.createElement("td");
  id_cell.appendChild(document.createTextNode("N"));
  add_row.appendChild(id_cell);

  // create lastname field
  let new_cell = document.createElement("td");

  let new_input = document.createElement("input");
  new_input.id = `lastname_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  // create firstname field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `firstname_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  // create url field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `emailaddr_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);


  // submit button
  const submit_cell = document.createElement("td");

  const submit_button = document.createElement("button");
  submit_button.setAttribute("onclick", "submit_new()");
  submit_button.appendChild(document.createTextNode("Append"));
  submit_cell.appendChild(submit_button);

  add_row.appendChild(submit_cell);

  new_table.appendChild(add_row);

  // replace the HTML with the new formed table
  students_list.replaceChildren(new_table);
} // prep_table()

/* only called when button pressed */
async function get_students() {
  // get the div where the students will be shown
  const students_list = document.getElementById("students-list");

  // show the spinner again & empty out the previous table
  students_list.innerHTML = `<div class="spinner-border" role="status" id="students-spinner">`;

  // table creation
  const new_table = document.createElement("table");
  const header_row = document.createElement("tr");

  // make the header row
  const student_attrs = ["#", "Last Name", "First Name", "Email Address", "Options"];
  for (const attr of student_attrs) {
    const new_cell = document.createElement("th");
    // create text node handles sanitation
    new_cell.appendChild(document.createTextNode(attr));
    header_row.appendChild(new_cell);
  }
  new_table.appendChild(header_row); // add header row


  // get our students from the backend
  const response = await fetch(`${server_url}/api/students`);
  const students = await response.json();

  if (response.status != 200) { // if its returning a non 200 code, it's likely not running.
    alert("Backend returned non-200 code. Is it running?");
    return false;
  }

  // cycle through each student, creating a row per student
  for (const student of students) {
    const new_row = document.createElement("tr");

    //console.log(student);

    // I couldn't get a for loop to work, so I went with this weird function found below
    // https://www.geeksforgeeks.org/javascript/how-to-iterate-json-object-in-javascript/
    Object.keys(student).forEach((key) => {
      // create a new cell per key
      const new_cell = document.createElement("td");
      new_cell.id = `${key}_${student["id"]}`; // will use this later for the edit button
      if (key == "emailaddr") {
        // handle the email and make it clickable
        const link_element = document.createElement("a");
        link_element.href = `mailto:${student[key]}`;
        link_element.appendChild(document.createTextNode(student[key]));
        new_cell.appendChild(link_element);
      } else { // general case
        //console.log(`${key}: ${student[key]}`);
        new_cell.appendChild(document.createTextNode(student[key]));
      }
      new_row.appendChild(new_cell);
    });

    // append the options section cell at the end for CRUD operations
    const new_cell = document.createElement("td");

    // edit/PUT button
    const edit_button = document.createElement("button");
    edit_button.setAttribute("onclick", "student_edit(this)"); // set attribute is more consistent for non common items
    edit_button.setAttribute("class", "edit"); // though ".class" didn't work for this and every element has class, so I'm not sure.
    edit_button.appendChild(document.createTextNode("Edit"));
    new_cell.appendChild(edit_button);
    // DELETE button
    const delete_button = document.createElement("button");
    delete_button.setAttribute("onclick", "student_delete(this)"); // set attribute is more consistent for non common items
    delete_button.setAttribute("class", "delete"); // though ".class" didn't work for this and every element has class, so I'm not sure.
    delete_button.appendChild(document.createTextNode("Delete"));
    new_cell.appendChild(delete_button);

    // add the new cell to the row
    new_row.appendChild(new_cell);
    // add the new row, saving its corresponding ID
    new_row.id = student["id"];
    new_table.appendChild(new_row);
  }

  /* For POST Operation */
  const add_row = document.createElement("tr");
  const id_cell = document.createElement("td");
  id_cell.appendChild(document.createTextNode("N"));
  add_row.appendChild(id_cell);

  // create lastname field
  let new_cell = document.createElement("td");

  let new_input = document.createElement("input");
  new_input.id = `lastname_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  // create firstname field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `firstname_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  // create url field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `emailaddr_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);


  // submit button
  const submit_cell = document.createElement("td");

  const submit_button = document.createElement("button");
  submit_button.setAttribute("onclick", "submit_new()");
  submit_button.appendChild(document.createTextNode("Append"));
  submit_cell.appendChild(submit_button);

  add_row.appendChild(submit_cell);

  new_table.appendChild(add_row);

  // replace the HTML with the new formed table
  students_list.replaceChildren(new_table);
} // get_students()

/* PUT part 1, turns all the text objects into text fields to edit.
   passing "this" came from https://stackoverflow.com/a/6575272 and how to use "this" */
async function student_edit(triggering_button) {
  console.log(triggering_button);
  const student_row_element = triggering_button.parentElement.parentElement;
  const student_id = student_row_element.id;
  // obtain previous values
  const student_lastname = document.getElementById(`lastname_${student_id}`).innerText;
  const student_firstname = document.getElementById(`firstname_${student_id}`).innerText;
  const student_emailaddr = document.getElementById(`emailaddr_${student_id}`).innerText;

  //alert(`Edit for ${student_id}!`);
  // replace all the fields with text boxes to modify
  student_row_element.replaceChildren();

  const id_cell = document.createElement("td");
  id_cell.appendChild(document.createTextNode(student_id));

  student_row_element.appendChild(id_cell);

  // create lastname field
  let new_cell = document.createElement("td");

  let new_input = document.createElement("input");
  new_input.id = `lastname_${student_id}`;
  new_input.value = student_lastname; // set the default value to the prev value

  new_cell.appendChild(new_input);
  student_row_element.appendChild(new_cell);

  // create firstname field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `firstname_${student_id}`;
  new_input.value = student_firstname;

  new_cell.appendChild(new_input);
  student_row_element.appendChild(new_cell);

  // create emailaddr field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `emailaddr_${student_id}`;
  new_input.value = student_emailaddr;

  new_cell.appendChild(new_input);
  student_row_element.appendChild(new_cell);


  const submit_cell = document.createElement("td");

  const submit_button = document.createElement("button");
  submit_button.setAttribute("onclick", "submit_edits(this)");
  submit_button.appendChild(document.createTextNode("Submit"));
  submit_cell.appendChild(submit_button);

  student_row_element.appendChild(submit_cell);

} // student_edit(triggering_button)

/* DELETE */
async function student_delete(triggering_button) {
  const student_row_element = triggering_button.parentElement.parentElement;
  const student_id = student_row_element.id;
  
  
  // double check if the user didn't accidentally click it
  const confirmation = confirm(`Are you sure you want to delete student ${student_id}?`)

  if (!confirmation) {
    return true;
  }

  // send the delete req
  const response = await fetch(`${server_url}/api/students/${student_id}`,
    {
      method: "DELETE",
    }
  );

  // this shouldn't happen unless the front end is out of sync
  if (response.status != 200) {
    alert("Backend returned non-200 code!");
    return false;
  }
 
  return true;
} // student_delete(triggering_button)

/* PUT Part 2: Submission */
async function submit_edits(triggering_button) {
  const student_row_element = triggering_button.parentElement.parentElement;
  const student_id = student_row_element.id;
  //alert(`Submit Edit for ${student_id}!`);

  const student_lastname = document.getElementById(`lastname_${student_id}`).value;
  const student_firstname = document.getElementById(`firstname_${student_id}`).value;
  const student_emailaddr = document.getElementById(`emailaddr_${student_id}`).value;

  const response = await fetch(`${server_url}/api/students/${student_id}`,
    {
      method: "PUT",
      // Source - https://stackoverflow.com/a/29823632
      // Posted by Razor, modified by community. See post 'Timeline' for change history
      // Retrieved 2026-10-20, License - CC BY-SA 4.0
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "lastname": student_lastname,
        "firstname": student_firstname,
        "emailaddr": student_emailaddr
      }),
    }
  );

  const res_txt = await response.text();

  if (response.status != 200) {
    alert(
      `Non 200 error! Backend says...\n${res_txt}`
    )
    return false;
  }

  return true;
} // submit_edits(triggering_button)

/* POST submit the items in the N row as a new row. */
async function submit_new() {
  const student_lastname = document.getElementById("lastname_new").value;
  const student_firstname = document.getElementById("firstname_new").value;
  const student_emailaddr = document.getElementById("emailaddr_new").value;

  const response = await fetch(`${server_url}/api/students/`,
    {
      method: "POST",
      // Source - https://stackoverflow.com/a/29823632
      // Posted by Razor, modified by community. See post 'Timeline' for change history
      // Retrieved 2026-10-20, License - CC BY-SA 4.0
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "firstname": student_firstname,
        "lastname": student_lastname,
        "emailaddr": student_emailaddr
      }),
    }
  );

  const res_txt = await response.text();

  if (response.status != 200) {
    alert(
      `Non 200 error! Backend says...\n${res_txt}`
    )
    return false;
  }

  // get the old table and append the new row just above the POST row

  const current_table = document.getElementById("students-list").childNodes[0];

  const new_json = `{"id": ${res_txt}, "lastname": "${student_lastname}", "firstname": "${student_firstname}", "emailaddr": "${student_emailaddr}"}`;

  console.log(new_json);

  student = JSON.parse(new_json);

  const new_row = document.createElement("tr");
  Object.keys(student).forEach((key) => {
    // create a new cell per key
    const new_cell = document.createElement("td");
    new_cell.id = `${key}_${student["id"]}`; // will use this later for the edit button
    if (key == "emailaddr") {
      // handle the email and make it clickable
      const link_element = document.createElement("a");
      link_element.href = `mailto:${student[key]}`;
      link_element.appendChild(document.createTextNode(student[key]));
      new_cell.appendChild(link_element);
    } else { // general case
      //console.log(`${key}: ${student[key]}`);
      new_cell.appendChild(document.createTextNode(student[key]));
    }
    new_row.appendChild(new_cell);
  });

  // append the options section cell at the end for CRUD operations
  const new_cell = document.createElement("td");

  // edit/PUT button
  const edit_button = document.createElement("button");
  edit_button.setAttribute("onclick", "student_edit(this)"); // set attribute is more consistent for non common items
  edit_button.setAttribute("class", "edit"); // though ".class" didn't work for this and every element has class, so I'm not sure.
  edit_button.appendChild(document.createTextNode("Edit"));
  new_cell.appendChild(edit_button);
  // DELETE button
  const delete_button = document.createElement("button");
  delete_button.setAttribute("onclick", "student_delete(this)"); // set attribute is more consistent for non common items
  delete_button.setAttribute("class", "delete"); // though ".class" didn't work for this and every element has class, so I'm not sure.
  delete_button.appendChild(document.createTextNode("Delete"));
  new_cell.appendChild(delete_button);

  // add the new cell to the row
  new_row.appendChild(new_cell);
  // add the new row, saving its corresponding ID
  new_row.id = student["id"];

  // Source - https://stackoverflow.com/a/5882802
  // Posted by Felix Kling, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-11-18, License - CC BY-SA 4.0

  table_children = current_table.childNodes;
  current_table.insertBefore(new_row, table_children[table_children.length-1]);


  return true;
} // submit_new()

async function select_single() {

  const id = document.getElementById("single-student").value;

  if (id === "") {
    alert("Please enter a number!")
    return false;
  }

  document.getElementById("single-student").value = "";

  // get our students from the backend
  const response = await fetch(`${server_url}/api/students/${id}`);

  let student;
  
  try {
    student = await response.json();
    console.log(student);
    student = student[0];
  } catch (error) {
    alert(`No student with ID ${id} found!`)
    return false;
  };

  if (response.status != 200) { // if its returning a non 200 code, it's likely not running.
    alert("Backend returned non-200 code. Is it running?");
    return false;
  }

  if (document.getElementById(`id_${id}`)) {
    alert("Student already in list!");
    return false;
  }

  const current_table = document.getElementById("students-list").childNodes[0];

  const new_row = document.createElement("tr");
  Object.keys(student).forEach((key) => {
    // create a new cell per key
    const new_cell = document.createElement("td");
    new_cell.id = `${key}_${student["id"]}`; // will use this later for the edit button
    if (key == "emailaddr") {
      // handle the email and make it clickable
      const link_element = document.createElement("a");
      link_element.href = `mailto:${student[key]}`;
      link_element.appendChild(document.createTextNode(student[key]));
      new_cell.appendChild(link_element);
    } else { // general case
      //console.log(`${key}: ${student[key]}`);
      new_cell.appendChild(document.createTextNode(student[key]));
    }
    new_row.appendChild(new_cell);
  });

  // append the options section cell at the end for CRUD operations
  const new_cell = document.createElement("td");

  // edit/PUT button
  const edit_button = document.createElement("button");
  edit_button.setAttribute("onclick", "student_edit(this)"); // set attribute is more consistent for non common items
  edit_button.setAttribute("class", "edit"); // though ".class" didn't work for this and every element has class, so I'm not sure.
  edit_button.appendChild(document.createTextNode("Edit"));
  new_cell.appendChild(edit_button);
  // DELETE button
  const delete_button = document.createElement("button");
  delete_button.setAttribute("onclick", "student_delete(this)"); // set attribute is more consistent for non common items
  delete_button.setAttribute("class", "delete"); // though ".class" didn't work for this and every element has class, so I'm not sure.
  delete_button.appendChild(document.createTextNode("Delete"));
  new_cell.appendChild(delete_button);

  // add the new cell to the row
  new_row.appendChild(new_cell);
  // add the new row, saving its corresponding ID
  new_row.id = student["id"];

  // Source - https://stackoverflow.com/a/5882802
  // Posted by Felix Kling, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-11-18, License - CC BY-SA 4.0

  table_children = current_table.childNodes;
  current_table.insertBefore(new_row, table_children[table_children.length-1]);

}