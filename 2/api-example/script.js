// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision
function round(x, n) {
  return x.toPrecision(n);
}

async function get_information() {
    const username = document.getElementById("username").value;
    const ranks_url = "https://tetr.io/res/league-ranks/"

    /*

    Current Standing Section -- STANDING

    */

    const standing_api_url = `https://tetrio.johang.dev/users/${username}/summaries/league` // gets the tetra league summary

    const standing_response = await fetch(standing_api_url);

    const standing_data = await standing_response.json();


    if (standing_data.success == false) {
        alert(`TETR.IO says ${standing_data.error.msg}`);
        return false;
    }


    const standing_summary = standing_data.data;

    const rank = standing_summary.percentile_rank;
    const rank_url = `${ranks_url}${rank}.png`

    const tetra_rating = standing_summary.tr;
    const tetra_placement = standing_summary.standing; // #XXXX

    if (tetra_rating == -1) {
        alert("Player has not played Tetra League!");
        return false;
    }


    const glicko = standing_summary.glicko;
    const glicko_rd = standing_summary.rd;

    const decaying = standing_summary.decaying;
    const percentile = standing_summary.percentile;

    // apply retrieved data to website

    const rank_img = document.getElementById("tetra-rank-img");
    rank_img.setAttribute("src", rank_url);

    const tetra_rating_ctnr = document.getElementById("tetra-rating");
    tetra_rating_ctnr.innerText = `${round(tetra_rating, 5)} SR`;

    const tetra_placement_ctnr = document.getElementById("tetra-placement");

    if (tetra_placement != "-1") { 
        tetra_placement_ctnr.innerText = `#${tetra_placement}`;
    } else {
        tetra_placement_ctnr.innerText = `Not Placed`; // Can either mean unranked or rank expired
    }

    rating_expiration_ctnr = document.getElementById("rating-expiration");

    // determining the # of days requires information from the next section.

    const percentile_ctnr = document.getElementById("percentile");

    percentile_ctnr.innerText = `${round(percentile*100, 4)}%`

    const glicko_ctnr = document.getElementById("glicko");
    glicko_ctnr.innerText = `${round(glicko, 5)}`

    const glicko_rd_ctnr = document.getElementById("glicko-rd");
    glicko_rd_ctnr.innerText = `${round(glicko_rd, 3)}`

    /* 

    
    W/L Section -- RECORD 
    
    */


    const record_api_url = `https://tetrio.johang.dev/labs/leagueflow/${username}` // gets a condensed version of TL w/l


    const record_response = await fetch(record_api_url);

    const record_data = await record_response.json()


    if (!record_data.success) {
        alert(`TETR.IO says ${record_data.error.msg}`)
        return false;
    }

    //console.log(data);
    /* An array of match objects
    Contents of each match object:
    0: timestamp offset
    1: result of match
        1: win, 2: loss, 3: opponent ff, 4: self ff, 5: tie, 6: both ff, 7: admin null
    2: user's TR after match
    3: opponent's TR before match
    */
    const matches = record_data.data.points;
    //console.log(matches);

    let wins = 0;
    let opp_ff = 0;
    let loss = 0;
    let self_ff = 0;
    let ties = 0;

    for (const match of matches) {
        //console.log(match[0]) // should return timestamps


        switch (match[1]) {
            case 1:
                wins += 1;
                break;
            case 2:
                loss += 1;
                break;
            case 3:
                opp_ff += 1;
                break;
            case 4:
                self_ff += 1;
                break;
            default:
                // the rest can classify as ties

                ties += 1;
        }
    }

    const win_rate = round(((wins+opp_ff) / (wins+opp_ff+loss+self_ff+ties)) * 100, 4); // get a win_rate percentage

    const won_ctnr = document.getElementById("games-won");
    const o_ff_ctnr = document.getElementById("games-won-ff");

    const lost_ctnr = document.getElementById("games-lost");
    const ff_ctnr = document.getElementById("games-lost-ff");
    const ties_ctnr = document.getElementById("games-tied");

    const win_pct_ctnr = document.getElementById("win-pct");

    won_ctnr.innerText = wins;
    o_ff_ctnr.innerText = opp_ff;
    win_pct_ctnr.innerText = `${win_rate}%`;

    lost_ctnr.innerText = loss;
    ff_ctnr.innerText = self_ff;
    ties_ctnr.innerText = ties;

    // Make the expiry section


    //console.log(`Today's Date: ${today_ts}`);



    // console.log(`Relative Days Since Last Game ${days_since_lg}`);

    if (decaying) {
        effective_rd_limit = 100;
    } else {
        const first_match_ts = record_data.data.startTime;
        const last_match_ts = matches[matches.length-1][0];

        const last_played = first_match_ts+last_match_ts;
        //console.log(`Last game played on: ${last_played}`);

        const today_ts = Date.now();
        const time_since_last_game = today_ts - last_played;
        const days_since_lg = time_since_last_game / 86400000;
        //console.log(`Relative time since last game: ${days_since_lg}`)
        effective_rd_limit = 100+(7-days_since_lg);
    }

    const days_to_decay = Math.floor(100-glicko_rd);
    const hours_to_decay = Math.ceil((100-glicko_rd-days_to_decay) * 24);



    if (glicko_rd >= 100) {

        rating_expiration_ctnr.setAttribute("class", "text-danger fs-6");
        rating_expiration_ctnr.innerText = "Rating Expired";

    } else {
        if (!decaying) {
            rating_expiration_ctnr.setAttribute("class", "text-success fs-6");
            rating_expiration_ctnr.innerText = `Rating Expires in ${days_to_decay} Days & ${hours_to_decay} Hours`
        } else {
            rating_expiration_ctnr.setAttribute("class", "text-warning-emphasis fs-6");
            rating_expiration_ctnr.innerText = `Rating Expires in ${days_to_decay} Days & ${hours_to_decay} Hours`
        }


    }


}