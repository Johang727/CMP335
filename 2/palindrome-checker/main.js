function check_and_add() {
    const new_word_container = document.getElementById("new-word");

    const case_sensitive = document.getElementById("case-sens-sw").checked;

    let new_word = new_word_container.value;




    if (!case_sensitive) {
        new_word = new_word.toLowerCase();
    }

    console.log(new_word);

    if (new_word == ""){
        alert("Please enter a word to check!")
        return false;
    }

    // Source - https://stackoverflow.com/a/45121372
    // Posted by NASEEM FASAL
    // Retrieved 2026-09-25, License - CC BY-SA 3.0
    // get algorithm choice
    const algo_choice = document.querySelector('input[name="algo-sw"]:checked').value;

    console.log(algo_choice);

    // define list elements

    if (algo_choice == "1") {
    const algo_1_list = document.getElementById("algo-1-list");
    const palindrome = algo_1(new_word);
    (algo_1_list.insertRow(algo_1_list.rows.length)).innerHTML = `(${new_word}: ${palindrome})`;
    } else if (algo_choice == "2") {
        const algo_2_list = document.getElementById("algo-2-list");
        const palindrome = algo_2(new_word);
        (algo_2_list.insertRow(algo_2_list.rows.length)).innerHTML = `(${new_word}: ${palindrome})`;
    } else {
        const algo_3_list = document.getElementById("algo-3-list");
        const palindrome = algo_3(new_word);
        (algo_3_list.insertRow(algo_3_list.rows.length)).innerHTML = `(${new_word}: ${palindrome})`;
    }
}

// check if the following is a palindrome. return true if it is
function algo_1(word_chk) {
    // Source - https://stackoverflow.com/a/959004
    // Posted by belacqua, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-09-25, License - CC BY-SA 4.0
    // Converts the string into an array then reverses it.
    const check = word_chk.split("").reverse().join("");

    if (check === word_chk) {
        return true;
    } else {
        return false;
    }
} 

// Source - https://stackoverflow.com/a/26610963
// Posted by Anil Arrabole, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-25, License - CC BY-SA 4.0
function algo_2(word_chk) {
    let rev_str = '';
    // goes backwards from indexes, starts at the final character and stops at the first 
    for (let i = word_chk.length - 1; i >= 0; i--)
        rev_str += word_chk[i];
    
    if (rev_str === word_chk) {
        return true;
    } else {
        return false;
    }
}

// Source - https://stackoverflow.com/a/26610963
// Posted by Anil Arrabole, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-25, License - CC BY-SA 4.0
function algo_3(word_chk) {

    function reverse(s) {
    return (s === '') ? '' : reverse(s.substr(1)) + s.charAt(0);
    }

    let rev_str = reverse(word_chk);


    if (rev_str === word_chk) {
        return true;
    } else {
        return false;
    }
}
