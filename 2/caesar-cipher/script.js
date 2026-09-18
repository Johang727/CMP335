async function getBaconipsum() {
  // first build the API call string by starting with the URL
  const apiString = "https://baconipsum.com/api/";
  // next add the parameters to the string using the drop down lists
  const paragraph_numbers = document.getElementById("newParagraphs").value;

  const meat_or_filler = document.getElementById("meat").value;

  const formatted_api_string = `${apiString}?type=${meat_or_filler}&paras=${paragraph_numbers}`

  alert(formatted_api_string);  // show the API string

  // now make the API call to the web service using the string and store what is returned in response
  const response = await fetch(formatted_api_string);

  // finally, print the response in the various formats
  document.getElementById("myRawData").innerHTML = "";   // clear what was previously shown
  document.getElementById("myFormattedData").innerHTML = "";   // clear what was previously shown

  const jsonData = await response.json();  // read the response as JSON
  
  // stringify and print out the JSON object in the RawData section
  document.getElementById("myRawData").innerHTML = JSON.stringify(jsonData);

  console.log(document.getElementById("myRawData").innerHTML);
 
  // loop through the JSON object one paragraph at a time and print each in the FormattedData section
  for (const para in jsonData) {   
      document.getElementById("myFormattedData").innerHTML += "<p>" + jsonData[para] + "</p>";
    }

  return true;
}

function caesar_cipher(str) {
  // assuming the input is myRawData

}
