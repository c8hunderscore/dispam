let shake;
let tokens;
let interval;
let theme = (localStorage.getItem("darkmode") == "true") || false;
let themeChanged = false;
let firstVisit = localStorage.getItem("firstVisit");

$(document).ready(() => {
    if (firstVisit == null) {
        firstVisit = false;
    } else {
        firstVisit = true;
    }
    localStorage.setItem("firstVisit", firstVisit);

    tokens = localStorage.getItem("tokens");
    if (tokens !== null) tokens = tokens.split(/\r?\n/);

    $("link[rel=stylesheet]").attr("href", `${theme ? "dark" : "light"}.css`);

    $("#tokenlist").val(tokens === null ? "" : tokens.join("\n"));

    $("main").css({
        "opacity": "50%",
        "margin-top": "50px"
    })
    $("main").css({
        "opacity": "100%",
        "margin-top": "+=25px"
    })

    if(!firstVisit) {
        let x = true;
        shake = setInterval(() => {
            x = !x;
            if (x) $("#title").css("padding-left", "0");
            else $("#title").css("padding-left", "10px");
        }, 500);
    }

    $("#title").click(() => {
        changeTheme();
        clearInterval(shake);
        $("#title").css("padding-left", "0");
    });
})

function updateTokens() {
    localStorage.setItem("tokens", $("#tokenlist").val());
    tokens = localStorage.getItem("tokens").split(/\r?\n/) || null;
}

function removeInvalidTokens() {
    tokens.forEach((t, i) => {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", "https://discord.com/api/v8/users/@me/settings");

        xhr.setRequestHeader("authorization", t);

        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 401) {
                    $("#tokenlist").val($("#tokenlist").val().replace(new RegExp(t+"\r?\n"), ""));
                } else if (xhr.responseText.includes("You need to verify your account in order to perform this action.")) {
                    $("#tokenlist").val($("#tokenlist").val().replace(new RegExp(t+"\r?\n"), ""));
                }
            }
        }
    })
    updateTokens();
}

function spam() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        $("#spambtn").text("Start Spamming");
        return;
    }
    else {
        let content = $("#msgcontent").val();
        let channel = $("#channel").val();
        let delay = $("#interval").val();

        $("#spambtn").text("Stop Spamming");
    
        let x = 0;
        interval = setInterval(() => {
            sendMessage(content, channel, tokens[x++ % tokens.length]);
        }, delay);
    }
}

function sendMessage(content, channel, token) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", `https://discord.com/api/v8/channels/${channel}/messages`)
    xhr.setRequestHeader("authorization", token);
    xhr.setRequestHeader("content-type", "application/json");

    xhr.send(JSON.stringify({ content }));

    /*
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            alert(xhr.responseText);
        }
    }
    */
}
 
function leave() {
    tokens.forEach(t => {
        let xhr = new XMLHttpRequest();
        let guildId = $("#leaveid").val();

        xhr.open("DELETE", `https://discord.com/api/v8/users/@me/guilds/${guildId}`);
        xhr.setRequestHeader("authorization", t);

        xhr.send();

        // xhr.onreadystatechange = () => {
        //     if (xh.readyState == 4) {
        //         alert(xhr.responseText);
        //     }
        // }
    })
}

function join() {
    tokens.forEach(t => {
        let xhr = new XMLHttpRequest();
        let invite = $("#invitelink").val();

        xhr.open("POST", `https://discord.com/api/v8/invites/${invite}`);
        xhr.setRequestHeader("authorization", t);

        xhr.send();
    })
}

function changeTheme() {
    theme = !theme;
    
    localStorage.setItem("darkmode", theme);

    $("link[rel=stylesheet]").attr("href", `${theme ? "dark" : "light"}.css`);
}

function react() {
    try {
        tokens.forEach((t, i) => {
            let xhr = new XMLHttpRequest();
            let channelid = $("#channelid").val();
            let msgid = $("#msgid").val();
            let reaction = $("#reaction").val();

            xhr.open("PUT", `https://discord.com/api/v8/channels/${channelid}/messages/${msgid}/reactions/${encodeURIComponent(reaction)}/@me`);

            xhr.setRequestHeader("authorization", t);

            setTimeout(() => xhr.send(), i * 200); // to battle gay ratelimit
        })
    } catch (e) {
        alert(e);
    }
}