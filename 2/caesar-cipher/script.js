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
    document.getElementById("encrypted-field").innerHTML = "";   // clear what was previously shown


  const jsonData = await response.json();  // read the response as JSON
  
  // stringify and print out the JSON object in the RawData section
  document.getElementById("myRawData").innerHTML = JSON.stringify(jsonData);

  //console.log(document.getElementById("myRawData").innerHTML);
 
  // loop through the JSON object one paragraph at a time and print each in the FormattedData section
  for (const para in jsonData) {   
      document.getElementById("myFormattedData").innerHTML += "<p>" + jsonData[para] + "</p>";
    }

  // how much to shift in the cipher
  const adjustment = +document.getElementById("adjust").value;

  // Doesn't make sense to shift 26 or higher because a = a then. Same with 0
  if (adjustment == 0 || adjustment < -25 || adjustment > 25) {
    alert("Adjustment value out of range!!");
    return false;
  }

  const algo = document.getElementById("algorithm").value;

  let encrypted_json;

  if (algo == 1) {
    encrypted_json = caesar_cipher1(jsonData, adjustment);
  }
  else {
    encrypted_json = caesar_cipher2(jsonData, adjustment);
  }



  for (const para in encrypted_json) {   
      document.getElementById("encrypted-field").innerHTML += "<p>" + encrypted_json[para] + "</p>";
    }

  return true;
}

function caesar_cipher1(jsonData, adjustment) {
  // assuming the input is myRawData

  console.log(`Original JSON: ${JSON.stringify(jsonData)} | Adjustment Amount: ${adjustment}`);

  let encrpyted_json = JSON.parse("[]"); // the new, empty JSON array

  // iterate through every paragraph in the JSON response
  for (const para in jsonData) {
    //console.log(`Paragraph: ${jsonData[para]}`);
    let new_string = ""; // new paragraph to put into JSON array
      // iterate through every character in the paragraph
      for (let i = 0; i < jsonData[para].length; i++) {
        //console.log(`Character: ${jsonData[para][i]}`); 
        let ascii = +jsonData[para].charCodeAt(i); // get ascii
        if (((96 < ascii) && (ascii < 123)) || ((64 < ascii) && (ascii < 91))) { // exclude punctuation, within range of alphabetical characters

          // check if lowercase for later
          let is_lowercase;
          if ((96 < ascii) && (ascii < 123)) {
            is_lowercase = true;
          } else {
            is_lowercase = false;
          }

          //console.log(`ASCII: ${ascii}`);
          ascii += adjustment; // shift user specified amount


          if (is_lowercase) {
            // if it exceeds the letter z, wrap around
            if (ascii > 122) {
              ascii -= 25;
            }

            // other way around to simulate reverse
            if (ascii < 97) {
              ascii += 25;
            }
          } else {
            //upper case letter, exceeds Z, wrap around
            if (ascii > 90) {
              ascii -= 25;
            }

            if (ascii < 65) {
              ascii += 25;
            }
          }
        }
        // append the shifted character to the new paragraph string
        new_string += String.fromCharCode(ascii);
      }
    
    //console.log(`New Paragraph: ${new_string}`);
    // add the new paragraph to the array
    encrpyted_json.push(new_string);
    }
  //console.log(`New JSON: ${JSON.stringify(encrpyted_json)}`);
  
  return encrpyted_json;
}

// this one was made by AI
function caesar_cipher2(jsonData, adjustment) {
  console.log(`Original JSON: ${JSON.stringify(jsonData)} | Adjustment Amount: ${adjustment}`);
  let encrypted_json = [];

  // Normalize the adjustment to handle values over 26 and negative numbers seamlessly
  const shift = ((adjustment % 26) + 26) % 26; // this isn't actually needed since error checking happens earlier

  for (const para in jsonData) {
    // The .replace() method with /[a-zA-Z]/g targets only letters, automatically ignoring punctuation
    let new_string = jsonData[para].replace(/[a-zA-Z]/g, (char) => {
      // Determine if the base ASCII value is for uppercase ('A' = 65) or lowercase ('a' = 97)
      const base = char <= 'Z' ? 65 : 97;
      
      // Shift from base 0, apply the adjustment, wrap with modulo 26, and restore to ASCII
      return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    }); // function to shift everything, uses regex to exclude punctuation. Does it all without a for loop
    
    //console.log(`New Paragraph: ${new_string}`);
    encrypted_json.push(new_string);
  }

  //console.log(`New JSON: ${JSON.stringify(encrypted_json)}`);
  return encrypted_json;
}