async function get_distros() {
    const server_url = "http://127.0.0.1:3002" // 3000 is used by VSC live server; 

    const distros_list = document.getElementById("distros-list");

    // show the spinner again
    distros_list.innerHTML = `<div class="spinner-border" role="status" id="distros-spinner">`

    const new_table = document.createElement("table");
    const header_row = document.createElement("tr")
    
    const distro_attrs = ["#", "Name", "Description", "URL", "Logo"];

    for (const attr of distro_attrs) {
        const new_cell = document.createElement("th");
        // create text node handles sanitation
        new_cell.appendChild(document.createTextNode(attr));
        header_row.appendChild(new_cell);
    }

    new_table.appendChild(header_row);

    const response = await fetch(`${server_url}/api/distros`);
    const distros = await response.json();

    for (const distro of distros) {
        const new_row = document.createElement("tr");

        console.log(distro);

        for (const elem of distro) {
            const new_cell = document.createElement("td")
            new_cell.appendChild(document.createTextNode(elem));
            new_row.appendChild(new_cell);
        }
        new_table.appendChild(new_row);
    }


    // replace the HTML with the new formed table
    distros_list.replaceChildren(new_table);
}