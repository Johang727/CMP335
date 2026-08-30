// checkboxes
const ppt_svs = document.getElementById("ppt-svs");
const ppt_sduo = document.getElementById("ppt-sduo");
const tec_vs = document.getElementById("tec-vs");
const tec_cvs = document.getElementById("tec-cvs");
const tetr_tl = document.getElementById("tetr-tl");

// sections
const ppt_rating = document.getElementById("ppt-rating-section");
const tec_rating = document.getElementById("tec-rating-section");
const tetr_rating = document.getElementById("tetrio-rating-section");

// entries

const ppt_sr = document.getElementById("ppt-rating");
const tec_sr = document.getElementById("tec-rating");
const tetr_sr = document.getElementById("tetrio-rating");


function ToggleSkillRating() {
    const ppt_entry = (ppt_svs.checked || ppt_sduo.checked);
    const tec_entry = (tec_vs.checked || tec_cvs.checked);
    const tetr_entry = tetr_tl.checked;

    if (ppt_entry) {
        ppt_rating.style = "";
        ppt_sr.setAttribute("required", "");
    }
    else {
        ppt_rating.style = "display: none;";
        ppt_sr.removeAttribute("required");
    }
    
    if (tec_entry & !ppt_entry) {
        tec_rating.style = "";
        tec_sr.setAttribute("required", "");
    }
    else {
        tec_rating.style = "display: none;";
        tec_sr.removeAttribute("required");
    }

    if (tetr_entry) {
        tetr_rating.style = "";
        tetr_sr.setAttribute("required", "");
    }
    else {
        tetr_rating.style = "display: none;";
        tetr_sr.removeAttribute("required");
    }
}

const UserField = document.getElementById("username");


function InformSuccess(event) {
    event.preventDefault();
    alert(`Thanks, ${UserField.value}! Good luck!`); 
    return true;
}