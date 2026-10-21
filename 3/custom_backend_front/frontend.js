const server_url = "http://127.0.0.1:3002"; // 3000 is used by VSC live server;

// called when updating & on page load
async function get_distros() {
  // get the div where the distros will be shown
  const distros_list = document.getElementById("distros-list");

  // show the spinner again & empty out the previous table
  distros_list.innerHTML = `<div class="spinner-border" role="status" id="distros-spinner">`;

  // table creation
  const new_table = document.createElement("table");
  const header_row = document.createElement("tr");

  // make the header row
  const distro_attrs = ["#", "Name", "Description", "URL", "Logo", "Options"];
  for (const attr of distro_attrs) {
    const new_cell = document.createElement("th");
    // create text node handles sanitation
    new_cell.appendChild(document.createTextNode(attr));
    header_row.appendChild(new_cell);
  }
  new_table.appendChild(header_row); // add header row


  // get our distros from the backend
  const response = await fetch(`${server_url}/api/distros`);
  const distros = await response.json();

  if (response.status != 200) { // if its returning a non 200 code, it's likely not running.
    alert("Backend returned non-200 code. Is it running?");
    return false;
  }

  // cycle through each distro, creating a row per distro
  for (const distro of distros) {
    const new_row = document.createElement("tr");

    //console.log(distro);

    // I couldn't get a for loop to work, so I went with this weird function found below
    // https://www.geeksforgeeks.org/javascript/how-to-iterate-json-object-in-javascript/
    Object.keys(distro).forEach((key) => {
      // create a new cell per key
      const new_cell = document.createElement("td");
      new_cell.id = `${key}_${distro["id"]}`; // will use this later for the edit button
      if (key == "img_src") {
        // handle the icon
        const img_element = document.createElement("img");
        img_element.src = distro[key];
        img_element.style = "max-height: 40px;";
        new_cell.appendChild(img_element);
      } else if (key == "url") {
        // handle the url and make it clickable
        const link_element = document.createElement("a");
        link_element.href = distro[key];
        link_element.appendChild(document.createTextNode(distro[key]));
        new_cell.appendChild(link_element);
      } else { // general case
        //console.log(`${key}: ${distro[key]}`);
        new_cell.appendChild(document.createTextNode(distro[key]));
      }
      new_row.appendChild(new_cell);
    });

    // append the options section cell at the end for CRUD operations
    const new_cell = document.createElement("td");

    // edit/PUT button
    const edit_button = document.createElement("button");
    edit_button.setAttribute("onclick", "distro_edit(this)"); // set attribute is more consistent for non common items
    edit_button.setAttribute("class", "edit"); // though ".class" didn't work for this and every element has class, so I'm not sure.
    edit_button.appendChild(document.createTextNode("Edit"));
    new_cell.appendChild(edit_button);
    // DELETE button
    const delete_button = document.createElement("button");
    delete_button.setAttribute("onclick", "distro_delete(this)"); // set attribute is more consistent for non common items
    delete_button.setAttribute("class", "delete"); // though ".class" didn't work for this and every element has class, so I'm not sure.
    delete_button.appendChild(document.createTextNode("Delete"));
    new_cell.appendChild(delete_button);

    // add the new cell to the row
    new_row.appendChild(new_cell);
    // add the new row, saving its corresponding ID
    new_row.id = distro["id"];
    new_table.appendChild(new_row);
  }

  // for POST operation
  const add_row = document.createElement("tr");
  const id_cell = document.createElement("td");
  id_cell.appendChild(document.createTextNode("N"));
  add_row.appendChild(id_cell);

  // create name field
  let new_cell = document.createElement("td");

  let new_input = document.createElement("input");
  new_input.id = `name_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  // create desc field
  new_cell = document.createElement("td");

  new_input = document.createElement("textarea");
  new_input.id = `desc_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  // create url field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `url_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  // create img_src field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `img_src_new`;

  new_cell.appendChild(new_input);
  add_row.appendChild(new_cell);

  const submit_cell = document.createElement("td");

  const submit_button = document.createElement("button");
  submit_button.setAttribute("onclick", "submit_new()");
  submit_button.appendChild(document.createTextNode("Append"));
  submit_cell.appendChild(submit_button);

  add_row.appendChild(submit_cell);

  new_table.appendChild(add_row);

  // replace the HTML with the new formed table
  distros_list.replaceChildren(new_table);
} // get_distros()

// PUT part 1, turns all the text objects into text fields to edit.
// passing "this" came from https://stackoverflow.com/a/6575272 and how to use "this"
async function distro_edit(triggering_button) {
  console.log(triggering_button);
  const distro_row_element = triggering_button.parentElement.parentElement;
  const distro_id = distro_row_element.id;
  // obtain previous values
  const distro_name = document.getElementById(`name_${distro_id}`).innerText;
  const distro_desc = document.getElementById(`desc_${distro_id}`).innerText;
  const distro_url = document.getElementById(`url_${distro_id}`).innerText;
  const distro_img_src = document.getElementById(`img_src_${distro_id}`).children[0].src; // this one has an img object nested within, not just text

  //alert(`Edit for ${distro_id}!`);
  // replace all the fields with text boxes to modify
  distro_row_element.replaceChildren();

  const id_cell = document.createElement("td");
  id_cell.appendChild(document.createTextNode(distro_id));

  distro_row_element.appendChild(id_cell);

  // create name field
  let new_cell = document.createElement("td");

  let new_input = document.createElement("input");
  new_input.id = `name_${distro_id}`;
  new_input.value = distro_name; // set the default value to the prev value

  new_cell.appendChild(new_input);
  distro_row_element.appendChild(new_cell);

  // create desc field
  new_cell = document.createElement("td");

  new_input = document.createElement("textarea");
  new_input.id = `desc_${distro_id}`;
  new_input.value = distro_desc;

  new_cell.appendChild(new_input);
  distro_row_element.appendChild(new_cell);

  // create url field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `url_${distro_id}`;
  new_input.value = distro_url;

  new_cell.appendChild(new_input);
  distro_row_element.appendChild(new_cell);

  // create img_src field
  new_cell = document.createElement("td");

  new_input = document.createElement("input");
  new_input.id = `img_src_${distro_id}`;
  new_input.value = distro_img_src;

  new_cell.appendChild(new_input);
  distro_row_element.appendChild(new_cell);

  const submit_cell = document.createElement("td");

  const submit_button = document.createElement("button");
  submit_button.setAttribute("onclick", "submit_edits(this)");
  submit_button.appendChild(document.createTextNode("Submit"));
  submit_cell.appendChild(submit_button);

  distro_row_element.appendChild(submit_cell);

} // distro_edit(triggering_button)

// DELETE
async function distro_delete(triggering_button) {
  const distro_row_element = triggering_button.parentElement.parentElement;
  const distro_id = distro_row_element.id;
  
  
  // double check if the user didn't accidentally click it
  const confirmation = confirm(`Are you sure you want to delete element ${distro_id}?`)

  if (!confirmation) {
    return true;
  }

  // send the delete req
  const response = await fetch(`${server_url}/api/distros/${distro_id}`,
    {
      method: "DELETE",
    }
  );

  // this shouldn't happen unless the front end is out of sync
  if (response.status != 200) {
    alert("Backend returned non-200 code!");
    return false;
  }


  await get_distros();

  return true;
} // distro_delete(triggering_button)

// PUT part 2: submission
async function submit_edits(triggering_button) {
  const distro_row_element = triggering_button.parentElement.parentElement;
  const distro_id = distro_row_element.id;
  //alert(`Submit Edit for ${distro_id}!`);

  const distro_name = document.getElementById(`name_${distro_id}`).value;
  const distro_desc = document.getElementById(`desc_${distro_id}`).value;
  const distro_url = document.getElementById(`url_${distro_id}`).value;
  const distro_img_src = document.getElementById(`img_src_${distro_id}`).value;

  const response = await fetch(`${server_url}/api/distros/${distro_id}`,
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
        "name": distro_name,
        "desc": distro_desc,
        "url": distro_url,
        "img_src": distro_img_src
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

  await get_distros();

  return true;
} // submit_edits(triggering_button)

// POST submit the items in the N row as a new row.
async function submit_new() {
  const distro_name = document.getElementById("name_new").value;
  const distro_desc = document.getElementById("desc_new").value;
  const distro_url = document.getElementById("url_new").value;
  const distro_img_src = document.getElementById("img_src_new").value;

  const response = await fetch(`${server_url}/api/distros/`,
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
        "name": distro_name,
        "desc": distro_desc,
        "url": distro_url,
        "img_src": distro_img_src
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

  await get_distros();

  return true;
} // submit_new()