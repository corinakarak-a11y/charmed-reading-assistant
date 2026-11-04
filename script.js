console.log("CHARMED JavaScript is working!");

// ===================================
// CHARMED: MAGICAL STAR CURSOR
// ===================================

const magicCursor = document.getElementById("magic-cursor");

if (magicCursor) {
    document.addEventListener("mousemove", (event) => {
        magicCursor.style.left = `${event.clientX}px`;
        magicCursor.style.top = `${event.clientY}px`;
        magicCursor.classList.add("visible");
    });

    document.addEventListener("mouseleave", () => {
        magicCursor.classList.remove("visible");
    });
}


// ===================================
// CHARMED: MAGICAL SPARKLE TRAIL
// ===================================

let lastSparkleTime = 0;

document.addEventListener("mousemove", (event) => {
    const currentTime = Date.now();

    if (currentTime - lastSparkleTime < 40) {
        return;
    }

    lastSparkleTime = currentTime;

    const sparkle = document.createElement("span");

    sparkle.classList.add("magic-sparkle");
    sparkle.textContent = Math.random() > 0.5 ? "✦" : "✧";

    if (Math.random() > 0.5) {
        sparkle.classList.add("rose");
    }

    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 800);
});


// ===================================
// CHARMED: TWINKLING BACKGROUND STARS
// ===================================

const numberOfStars = 35;

for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("span");

    star.classList.add("background-star");
    star.textContent = Math.random() > 0.5 ? "✦" : "✧";

    if (Math.random() > 0.65) {
        star.classList.add("rose-star");
    }

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    star.style.fontSize = `${6 + Math.random() * 8}px`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 5}s`;

    document.body.appendChild(star);
}


// ===================================
// CHARMED: BUTTON STAR BURST
// ===================================

const beginButton = document.getElementById("begin-button");

if (beginButton) {
    beginButton.addEventListener("click", (event) => {
        const clickX = event.clientX;
        const clickY = event.clientY;

        const starSymbols = ["✦", "✧", "✦", "✧"];

        for (let i = 0; i < 18; i++) {
            const star = document.createElement("span");

            star.classList.add("click-star");

            if (Math.random() > 0.5) {
                star.classList.add("rose-star");
            }

            star.textContent =
                starSymbols[Math.floor(Math.random() * starSymbols.length)];

            const angle = (Math.PI * 2 * i) / 18;
            const distance = 35 + Math.random() * 65;

            star.style.left = `${clickX}px`;
            star.style.top = `${clickY}px`;

            star.style.setProperty(
                "--star-x",
                `${Math.cos(angle) * distance}px`
            );

            star.style.setProperty(
                "--star-y",
                `${Math.sin(angle) * distance}px`
            );

            star.style.fontSize = `${10 + Math.random() * 9}px`;
            star.style.animationDelay = `${Math.random() * 0.12}s`;

            document.body.appendChild(star);

            setTimeout(() => {
                star.remove();
            }, 1100);
        }
    });
}


// ===================================
// CHARMED: SCREEN TRANSITIONS
// WELCOME -> INTRODUCTION -> READING PROFILE
// ===================================

const introScreen = document.getElementById("intro-screen");
const welcomeScreen = document.getElementById("welcome-screen");
const profileScreen = document.getElementById("profile-screen");
const introDescription = document.getElementById("intro-description");
const introInstruction = document.getElementById("intro-instruction");
const storyScreen = document.getElementById("story-screen");
const storyContinueButton = document.getElementById("story-continue-button");

let typingTimer = null;
let introSequenceStarted = false;

let storyButtonShown = false;
const storyButtonDelay = 2500;     // how long before "Continue" fades in

function startStorySequence() {
    if (!storyContinueButton || storyButtonShown) return;
    storyButtonShown = true;

    window.setTimeout(() => {
        storyContinueButton.classList.add("visible");
    }, storyButtonDelay);
}

function startIntroductionSequence() {
    if (!introDescription || introSequenceStarted) return;
    introSequenceStarted = true;

    const text = introDescription.dataset.text || "";
    introDescription.textContent = "";
    introDescription.classList.add("typing");

    // Give the greeting time to settle before the message begins typing.
    const initialDelay = 1500;
    const typingSpeed = 34;
    let index = 0;

    typingTimer = window.setTimeout(function typeNextCharacter() {
        if (!introScreen || !introScreen.classList.contains("active")) return;

        introDescription.textContent += text.charAt(index);
        index += 1;

        if (index < text.length) {
            typingTimer = window.setTimeout(typeNextCharacter, typingSpeed);
        } else {
            introDescription.classList.remove("typing");
            // The instruction appears only after the full message has finished typing.
            window.setTimeout(() => {
                if (introInstruction && introScreen.classList.contains("active")) {
                    introInstruction.classList.add("visible");
                    introInstruction.setAttribute("aria-hidden", "false");
                }
            }, 350);
        }
    }, initialDelay);
}

function showScreen(screenToShow, screenToHide, leavingClass = "leaving") {
    if (!screenToShow || !screenToHide) return;
    screenToHide.classList.add(leavingClass);

    window.setTimeout(() => {
        screenToHide.classList.remove("active", leavingClass);
        screenToShow.classList.add("active");

        // Always open a screen scrolled to the top, so it never
        // appears to jump in partway down the page.
        if (typeof screenToShow.scrollTo === "function") {
            screenToShow.scrollTo(0, 0);
        } else {
            screenToShow.scrollTop = 0;
        }

        if (screenToShow === introScreen) {
            // Reset the typing sequence each time the intro is opened.
            introSequenceStarted = false;
            if (typingTimer) window.clearTimeout(typingTimer);
            if (introDescription) {
                introDescription.textContent = "";
                introDescription.classList.remove("typing");
            }
            if (introInstruction) {
                introInstruction.classList.remove("visible");
                introInstruction.setAttribute("aria-hidden", "true");
            }
            startIntroductionSequence();
        }

        if (screenToShow === storyScreen) {
            // Reset the Continue button each time this screen opens.
            storyButtonShown = false;
            if (storyContinueButton) {
                storyContinueButton.classList.remove("visible");
            }
            startStorySequence();
        }
    }, 650);
}

if (introScreen && welcomeScreen && profileScreen) {
    // The original CHARMED book-cover screen is the first screen visitors see.
    welcomeScreen.classList.add("active");
    welcomeScreen.classList.remove("leaving");
    introScreen.classList.remove("active", "leaving");
    profileScreen.classList.remove("active");

    // Begin your reading profile opens the introduction, not the questionnaire yet.
    if (beginButton) {
        beginButton.addEventListener("click", () => {
            if (welcomeScreen.classList.contains("leaving")) return;
            showScreen(introScreen, welcomeScreen);
        });
    }

    // "Take the Quiz" button advances from the introduction to the story screen.
    if (introInstruction) {
        introInstruction.addEventListener("click", () => {
            if (!introScreen.classList.contains("active") || introScreen.classList.contains("leaving")) return;
            if (!introInstruction.classList.contains("visible")) return;
            showScreen(storyScreen, introScreen);
        });
    }

    // "Continue" on the story screen advances to the actual question.
    if (storyContinueButton) {
        storyContinueButton.addEventListener("click", () => {
            if (!storyScreen.classList.contains("active") || storyScreen.classList.contains("leaving")) return;
            if (!storyContinueButton.classList.contains("visible")) return;
            showScreen(profileScreen, storyScreen);
        });
    }
}



// ===================================
// CHARMED: PERSONAL READING ASSISTANT
// ===================================
const app = document.getElementById("charmed-app");
const profileProgress = document.querySelector(".profile-progress");
const profileLogo = document.getElementById("profile-logo");

const GENRES = {
 romance: {name:"Romance", books:[
 ["The Love Hypothesis","Ali Hazelwood"],["Book Lovers","Emily Henry"],["It Ends with Us","Colleen Hoover"],["The Hating Game","Sally Thorne"],["The Kiss Quotient","Helen Hoang"],["Beach Read","Emily Henry"],["Red, White & Royal Blue","Casey McQuiston"],["The Notebook","Nicholas Sparks"],["The Seven Year Slip","Ashley Poston"],["The Flatshare","Beth O'Leary"],["People We Meet on Vacation","Emily Henry"],["The Spanish Love Deception","Elena Armas"],["One Day","David Nicholls"]],
 authors:[["Emily Henry",["Beach Read","Book Lovers","Happy Place"]],["Colleen Hoover",["It Ends with Us","Ugly Love","Reminders of Him"]],["Ali Hazelwood",["The Love Hypothesis","Love on the Brain","Check & Mate"]],["Jasmine Guillory",["The Wedding Date","The Proposal","While We Were Dating"]],["Christina Lauren",["The Unhoneymooners","The Soulmate Equation","Love and Other Words"]]],
 recs:[["The Bodyguard","Katherine Center"],["Get a Life, Chloe Brown","Talia Hibbert"],["The Flatshare","Beth O’Leary"],["The Seven Year Slip","Ashley Poston"],["The Very Secret Society of Irregular Witches","Sangu Mandanna"],["The Kiss Curse","Erin Sterling"],["The Wedding Date","Jasmine Guillory"],["The Soulmate Equation","Christina Lauren"]]},
 fantasy:{name:"Fantasy",books:[
 ["A Court of Thorns and Roses","Sarah J. Maas"],["Fourth Wing","Rebecca Yarros"],["The Hobbit","J.R.R. Tolkien"],["The Name of the Wind","Patrick Rothfuss"],["The Priory of the Orange Tree","Samantha Shannon"],["The Cruel Prince","Holly Black"],["The Way of Kings","Brandon Sanderson"],["The Night Circus","Erin Morgenstern"],["The Poppy War","R.F. Kuang"],["The Lies of Locke Lamora","Scott Lynch"],["The Final Empire","Brandon Sanderson"],["The Once and Future King","T.H. White"],["The Atlas Six","Olivie Blake"]],
 authors:[["Sarah J. Maas",["A Court of Thorns and Roses","Throne of Glass","Crescent City"]],["Brandon Sanderson",["The Final Empire","The Way of Kings","Warbreaker"]],["Leigh Bardugo",["Shadow and Bone","Six of Crows","Ninth House"]],["Holly Black",["The Cruel Prince","The Wicked King","The Queen of Nothing"]],["Tasha Suri",["The Jasmine Throne","The Oleander Sword","The Lotus Empire"]]],
 recs:[["The Jasmine Throne","Tasha Suri"],["The Adventures of Amina al-Sirafi","S.A. Chakraborty"],["The Goblin Emperor","Katherine Addison"],["The Bear and the Nightingale","Katherine Arden"],["The City of Brass","S.A. Chakraborty"],["The Bone Season","Samantha Shannon"],["The Golem and the Jinni","Helene Wecker"],["The Grace of Kings","Ken Liu"]]},
 mystery:{name:"Mystery",books:[
 ["And Then There Were None","Agatha Christie"],["The Girl with the Dragon Tattoo","Stieg Larsson"],["Gone Girl","Gillian Flynn"],["The Silent Patient","Alex Michaelides"],["The Thursday Murder Club","Richard Osman"],["The Da Vinci Code","Dan Brown"],["The Murder of Roger Ackroyd","Agatha Christie"],["The Guest List","Lucy Foley"],["The Woman in the Window","A.J. Finn"],["The Reversal","Michael Connelly"],["The Maid","Nita Prose"],["Big Little Lies","Liane Moriarty"],["The Cuckoo's Calling","Robert Galbraith"]],
 authors:[["Agatha Christie",["And Then There Were None","Murder on the Orient Express","The Murder of Roger Ackroyd"]],["Gillian Flynn",["Gone Girl","Sharp Objects","Dark Places"]],["Lucy Foley",["The Guest List","The Hunting Party","The Paris Apartment"]],["Ruth Ware",["The Woman in Cabin 10","The Turn of the Key","The It Girl"]],["Anthony Horowitz",["Magpie Murders","The Word Is Murder","Moonflower Murders"]]],
 recs:[["The It Girl","Ruth Ware"],["The Appeal","Janice Hallett"],["The Last House Guest","Megan Miranda"],["The Dry","Jane Harper"],["The Sanatorium","Sarah Pearse"],["The 7½ Deaths of Evelyn Hardcastle","Stuart Turton"],["The Plot","Jean Hanff Korelitz"],["The Kind Worth Killing","Peter Swanson"]]},
 horror:{name:"Horror",books:[
 ["The Shining","Stephen King"],["It","Stephen King"],["Frankenstein","Mary Shelley"],["Dracula","Bram Stoker"],["Mexican Gothic","Silvia Moreno-Garcia"],["The Haunting of Hill House","Shirley Jackson"],["Bird Box","Josh Malerman"],["The Exorcist","William Peter Blatty"],["The Only Good Indians","Stephen Graham Jones"],["The Silence of the Lambs","Thomas Harris"],["The Cabin at the End of the World","Paul Tremblay"],["House of Leaves","Mark Z. Danielewski"],["Pet Sematary","Stephen King"]],
 authors:[["Stephen King",["The Shining","It","Pet Sematary"]],["Shirley Jackson",["The Haunting of Hill House","We Have Always Lived in the Castle","The Lottery"]],["Silvia Moreno-Garcia",["Mexican Gothic","Certain Dark Things","The Daughter of Doctor Moreau"]],["T. Kingfisher",["The Twisted Ones","The Hollow Places","A House with Good Bones"]],["Paul Tremblay",["A Head Full of Ghosts","The Cabin at the End of the World","Survivor Song"]]],
 recs:[["The September House","Carissa Orlando"],["Our Wives Under the Sea","Julia Armfield"],["The Fisherman","John Langan"],["The Twisted Ones","T. Kingfisher"],["The Hacienda","Isabel Cañas"],["The Changeling","Victor LaValle"],["The Between","Tananarive Due"],["The Good House","Tananarive Due"]]},
 literary:{name:"Literary Fiction",books:[
 ["A Little Life","Hanya Yanagihara"],["Normal People","Sally Rooney"],["The Goldfinch","Donna Tartt"],["The Secret History","Donna Tartt"],["Atonement","Ian McEwan"],["The Remains of the Day","Kazuo Ishiguro"],["Beloved","Toni Morrison"],["The Great Gatsby","F. Scott Fitzgerald"],["The Midnight Library","Matt Haig"],["Conversations with Friends","Sally Rooney"],["The Book Thief","Markus Zusak"],["The Kite Runner","Khaled Hosseini"],["Tomorrow, and Tomorrow, and Tomorrow","Gabrielle Zevin"]],
 authors:[["Sally Rooney",["Normal People","Conversations with Friends","Beautiful World, Where Are You"]],["Donna Tartt",["The Secret History","The Goldfinch","The Little Friend"]],["Kazuo Ishiguro",["Never Let Me Go","The Remains of the Day","Klara and the Sun"]],["Brit Bennett",["The Vanishing Half","The Mothers","The Fiction of Us"]],["Gabrielle Zevin",["Tomorrow, and Tomorrow, and Tomorrow","The Storied Life of A.J. Fikry","Young Jane Young"]]],
 recs:[["Writers & Lovers","Lily King"],["The Rachel Incident","Caroline O’Donoghue"],["Cleopatra and Frankenstein","Coco Mellors"],["The Paper Palace","Miranda Cowley Heller"],["The Vanishing Half","Brit Bennett"],["The Great Believers","Rebecca Makkai"],["The Interestings","Meg Wolitzer"],["The Dutch House","Ann Patchett"]]},
 scifi:{name:"Science Fiction",books:[
 ["Dune","Frank Herbert"],["The Martian","Andy Weir"],["Project Hail Mary","Andy Weir"],["The Hunger Games","Suzanne Collins"],["The Handmaid's Tale","Margaret Atwood"],["Neuromancer","William Gibson"],["Fahrenheit 451","Ray Bradbury"],["The Left Hand of Darkness","Ursula K. Le Guin"],["The Three-Body Problem","Liu Cixin"],["The Long Way to a Small, Angry Planet","Becky Chambers"],["Kindred","Octavia E. Butler"],["Station Eleven","Emily St. John Mandel"],["Ender's Game","Orson Scott Card"]],
 authors:[["Ursula K. Le Guin",["The Left Hand of Darkness","The Dispossessed","A Wizard of Earthsea"]],["Andy Weir",["The Martian","Project Hail Mary","Artemis"]],["Margaret Atwood",["The Handmaid's Tale","Oryx and Crake","The Testaments"]],["Becky Chambers",["The Long Way to a Small, Angry Planet","A Closed and Common Orbit","Record of a Spaceborn Few"]],["Octavia E. Butler",["Kindred","Parable of the Sower","Dawn"]]],
 recs:[["Ancillary Justice","Ann Leckie"],["The Space Between Worlds","Micaiah Johnson"],["Sea of Tranquility","Emily St. John Mandel"],["The Long Way to a Small, Angry Planet","Becky Chambers"],["A Memory Called Empire","Arkady Martine"],["The Power","Naomi Alderman"],["The Book of M","Peng Shepherd"],["The Calculating Stars","Mary Robinette Kowal"]]}
};
const state={name:"",answers:{},genres:[],primaryGenre:null,booksRead:[],authorsRead:[],authorCounts:{},newGenre:null,finalGenre:null,annualPopupSeen:false,statsPopupSeen:false,hypePopupSeen:false,confirmationCount:0,genreOnlyMode:false};
let step=0, selected=new Set(), timers=[];
const q=[
 {n:"02",q:"What do you usually look for in a book?",multi:true,opts:["A gripping plot","Interesting characters","Beautiful writing","Romance and relationships","Escapism and world-building","Emotional depth","Something thought-provoking"],key:"what"},
 {n:"03",q:"Where do you usually discover most of your new books?",opts:["TikTok / BookTok","Instagram","Goodreads","Bookshops","Friends and family","Book reviews and blogs","I prefer browsing and discovering books myself"],key:"discovery"},
 {n:"04",q:"What are you currently reading?",opts:["A popular bestseller","A book recommended by someone","Something I've been meaning to read for ages","An obscure or lesser-known title","Nothing at the moment!"],key:"current"},
 {n:"05",q:"How many books do you usually read in a year?",opts:["1–5","6–12","13–25","26–50","50+"],key:"annual"},
 {n:"06",q:"Do you set yourself annual reading goals?",opts:["Yes, every year!","Sometimes.","I prefer reading without a target.","I set goals but rarely achieve them."],key:"goals"},
 {n:"07",q:"How do you feel about your reading statistics?",opts:["I love tracking my progress.","I find them motivating.","I like seeing my progress, but don't take them too seriously.","I don't really care about numbers.","They sometimes make me feel like I should be reading more."],key:"stats"},
 {n:"08",q:"What do you usually do when you dislike a book?",opts:["DNF immediately. Life is too short.","Give it another chance.","Force myself to finish it.","Read reviews to see whether other people agree.","Feel guilty about abandoning it."],key:"dnf"},
 {n:"09",q:"How important are ratings and reviews when choosing your next read?",opts:["Very important. I always check them.","Somewhat important.","I occasionally look at them.","I prefer forming my own opinion."],key:"reviews"},
 {n:"10",q:"Have you ever read a book because everyone else was talking about it?",opts:["Absolutely. I need to know what the hype is about.","Yes, but only if it interests me.","Occasionally.","No, I prefer choosing my own books."],key:"hype"},
 {n:"11",q:"Have you ever felt behind on your reading?",opts:["Yes, especially when I see other people's reading updates.","Sometimes, when there are too many new releases.","Not really.","Never. I read at my own pace."],key:"behind"},
 {n:"12",q:"How important is it to read the popular books within your favourite genre?",opts:["Very. I want to be part of the conversation.","Quite important. I don't want to miss out.","Not particularly.","I actively avoid books just because they're popular."],key:"popular"},
 {n:"13",q:"Would you consider yourself a dedicated reader?",opts:["Definitely. Reading is a huge part of my life.","Yes, but I don't read as much as I'd like.","I'm more of a casual reader.","I'm not sure."],key:"dedicated"},
 {n:"14",q:"Be honest... Do you think reading more books makes someone a better reader?",opts:["Yes, experience matters!","To some extent.","Not necessarily.","Absolutely not. It's not a competition."],key:"better"}
];
function clearTimers(){timers.forEach(clearTimeout);timers=[]}
function later(fn,ms){const t=setTimeout(fn,ms);timers.push(t);return t}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function setProgress(label="PROFILE IN PROGRESS"){if(profileProgress)profileProgress.innerHTML=label}
function shell(kicker,title,desc,body,button="Continue",disabled=false){
 app.innerHTML=`<div class="charmed-panel screen-enter"><p class="profile-label">${kicker}</p><h2 class="profile-title">${title}</h2>${desc?`<p class="profile-description">${desc}</p>`:""}<div class="profile-divider"><span>✦</span></div>${body}<div class="charmed-actions"><button class="continue-button" id="next" ${disabled?"disabled":""}>${button} <span>↗</span></button></div></div>`;
 const btn=document.getElementById("next"); if(btn&&!disabled)btn.addEventListener("click",()=>{
  if(step>=2 && step<=q.length+1 && !state.genreOnlyMode){
   const item=q[step-2], value=item.multi?[...selected]:[...selected][0];
   const observation=questionJudgement(item.key,value);
   if(observation){showEditorialPopup("A small observation",observation,"I suppose that's true",()=>advance());return;}
  }
  advance();
 });
}
function questionJudgement(key,value){
 const v=Array.isArray(value)?value.join(", "):String(value||"");
 const c={
 annual:v==="1–5"?"Only one to five books? At that pace, your TBR is less a reading list and more a long-term inheritance.":v==="50+"?"Fifty or more? Extraordinary. Do you read in your sleep, or have the people around you simply learned not to expect your attention?":v==="26–50"?"Twenty-six to fifty. I hope you haven't started treating every quiet moment as an opportunity to increase it.":"Twelve books is perfectly reasonable. Unless you've just watched someone finish twelve in January. Comparisons do have a way of ruining a perfectly good number.",
 goals:v.includes("rarely")?"A goal you rarely achieve. Ambition in January, guilt by December.":v.includes("Yes")?"A yearly target. How organised. I trust you enjoy the small anxiety of watching the number fall behind schedule.":"No target at all? Very free-spirited. Or perhaps you prefer not to have the evidence recorded.",
 stats:v.includes("love")?"You love tracking the numbers. Excellent. At least the spreadsheet can confirm you're doing enough, even when you aren't quite convinced.":v.includes("motivating")?"Motivating, until someone else's numbers appear beside yours. Then the little dashboard becomes rather less encouraging.":v.includes("don't really")?"You don't care about the numbers. How refreshingly unconcerned. I wonder if that's still true when everyone else is posting theirs.":"You say you don't take the numbers too seriously. A sensible position, though your answers suggest you notice them more than you'd like.",
 dnf:v.includes("DNF immediately")?"You abandon books at the first sign of trouble? Efficient. Some might call it impatient.":v.includes("Force")?"You force yourself to finish. How dutiful. I hope the satisfaction makes up for the hours you didn't enjoy.":v.includes("guilty")?"Guilt over an unfinished book. Even your leisure reading seems to come with obligations.":"You give books another chance. Admirable patience, or reluctance to admit you've chosen the wrong one.",
 reviews:v.includes("Very important")?"You always check the ratings first. How brave to let strangers decide whether a book deserves your time.":v.includes("own opinion")?"You prefer your own opinion. Independent, certainly. Though it does make those thousands of reviews inconvenient.":"You consult reviews when it suits you. A little outside validation, but not so much that you have to admit you need it.",
 hype:v.includes("Absolutely")?"You need to know what the hype is about. So the conversation chooses your next read before you do. Convenient.":v.startsWith("No,")?"You avoid the hype? How determined. I wonder whether that's genuine preference or simply another way of making a point.":"You follow the hype selectively. A careful balance between having your own taste and not missing the conversation.",
 behind:v.startsWith("Yes")?"You feel behind. And yet the feed keeps offering you more people to catch up with.":v.startsWith("Never")?"Never? Either you've mastered ignoring everyone else, or you haven't been looking closely enough.":"Sometimes. Just often enough for the comparison to work. Social media is remarkably good at finding that little gap.",
 popular:v.startsWith("Very")?"You want to read the popular titles to join the conversation. A reading list, or an entry requirement?":v.startsWith("I actively")?"You avoid books because they're popular? How independent. Though popularity is still deciding what you read.":"Not particularly important, you say. Let's see how that feels when the next supposedly unmissable release arrives.",
 dedicated:v.startsWith("Definitely")?"A dedicated reader. Excellent. I hope you can maintain that standard, especially when life gets in the way.":v.startsWith("I'm more")?"A casual reader. Nothing wrong with that, though I imagine you selected that answer with a little hesitation.":"You want to read more than you do. A convenient way to feel you are never quite doing enough.",
 better:v.startsWith("Yes")?"More books make a better reader? Then I hope you've got your numbers in order. It would be awkward to fall behind your own definition.":v.startsWith("Absolutely not")?"A firm no. How principled. I wonder if you still believe that when someone announces they've read a hundred books this year.":"A little unsure. Perhaps the answer depends on how many books the person beside you has managed to finish."
 };
 const observedKeys=["discovery","annual","stats","reviews","behind","dedicated","better"];
 if(!observedKeys.includes(key)) return null;
 return c[key] ? `${state.name ? state.name + ", " : ""}${c[key]}` : null;
}
function showEditorialPopup(title,message,buttonText,onClose){
 const overlay=document.createElement("div");overlay.className="editorial-overlay";
 overlay.innerHTML=`<div class="editorial-modal" role="dialog" aria-modal="true"><span class="modal-star">✧</span><p class="profile-label">CHARMED HAS AN OBSERVATION</p><h3>${esc(title)}</h3><p>${esc(message)}</p><button type="button" class="continue-button" id="dismiss-observation">${esc(buttonText)} <span>↗</span></button></div>`;
 app.appendChild(overlay);overlay.querySelector("button").addEventListener("click",()=>{overlay.remove();onClose?.()});
}
function optionButtons(question,vals,multi=false,pre=[]){
 selected=new Set(pre);
 const body=`<div class="charmed-options ${multi?"multi":""}">${vals.map((v,i)=>`<button type="button" class="answer-option ${selected.has(v)?"selected":""}" data-value="${esc(v)}" aria-pressed="${selected.has(v)}">${esc(v)}</button>`).join("")}</div><p class="selection-note">${multi?"Select all that apply.":"Choose one answer."}</p>`;
 shell(`QUESTION ${question.n}`,question.q,multi?"Choose as many as you like.":"",body,"Continue",false);
 document.querySelectorAll(".answer-option").forEach(b=>b.addEventListener("click",()=>{
   const v=b.dataset.value;if(multi){selected.has(v)?selected.delete(v):selected.add(v)}else{selected=new Set([v])}
   document.querySelectorAll(".answer-option").forEach(x=>{const on=selected.has(x.dataset.value);x.classList.toggle("selected",on);x.setAttribute("aria-pressed",String(on))});
   document.getElementById("next").disabled=selected.size===0;
 }));
 document.getElementById("next").disabled=selected.size===0;
}
function advance(){
 if(step===0){const field=document.getElementById("reader-name");const name=(field?.value||"").trim();if(!name){field?.focus();return;}state.name=name.slice(0,32);step=1;renderQuestion();return;}
 if(step===1){state.answers.genres=[...document.querySelectorAll(".genre-choice.selected")].map(x=>x.dataset.genre);if(!state.answers.genres.length)return;step=2;renderQuestion();return;}
 if(step>=2&&step<=q.length+1){const item=q[step-2];if(!selected.size)return;state.answers[item.key]=item.multi?[...selected]:[...selected][0];step++;if(step===5)loading(["Interesting choices... I've recorded your answers.","Collecting your reading habits..."],()=>renderQuestion());else if(step===q.length+2)loading(["All answers recorded.","Building your reader profile..."],startNarrowing);else renderQuestion();return;}
}
function renderQuestion(){
 if(step===0){setProgress("WELCOME / 01");shell("FIRST, A FORMALITY","What should I call you?","I'd like to make this a little more personal.",`<div class="name-entry"><label for="reader-name">YOUR NAME</label><input id="reader-name" class="reader-name-input" type="text" maxlength="32" placeholder="Enter your name..." autocomplete="given-name"></div>`,"Continue",false);const field=document.getElementById("reader-name");field?.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("next").click()});field?.focus();return;}
 if(step===1){setProgress("01 / 14");const genres=[["romance","Romance"],["fantasy","Fantasy"],["mystery","Mystery"],["horror","Horror"],["literary","Literary Fiction"],["scifi","Science Fiction"]];shell("QUESTION 01","What do you feel like reading?","Choose every genre that calls to you.",`<div class="genre-grid">${genres.map(([id,n])=>`<button type="button" class="genre-card genre-choice ${state.answers.genres?.includes(id)?"selected":""}" data-genre="${id}" aria-pressed="${state.answers.genres?.includes(id)?"true":"false"}"><img src="images/genre-${id}.png" alt="" class="genre-image"><span class="genre-name">${n}</span></button>`).join("")}</div><p class="selection-note">You can choose more than one.</p>`,"Continue",false);document.querySelectorAll(".genre-choice").forEach(c=>c.addEventListener("click",()=>{c.classList.toggle("selected");c.setAttribute("aria-pressed",String(c.classList.contains("selected")))}));return;}
 if(step>=2&&step<=q.length+1){const item=q[step-2];setProgress(`${String(step).padStart(2,"0")} / 14`);optionButtons(item,item.opts,item.multi);return;}
}
function loading(lines,done,chaos=false){
 clearTimers();app.innerHTML=`<div class="processing-screen"><p class="profile-label">CHARMED / ANALYSIS</p><div class="processing-orb">✦</div><h2 class="profile-title">Finding your next read...</h2><div class="processing-lines" id="processing-lines"></div><div class="processing-track"><span></span></div></div>`;
 let i=0;function show(){const el=document.getElementById("processing-lines");if(!el)return;if(i<lines.length){el.innerHTML+=`<p class="processing-line">✧ ${esc(lines[i++])}</p>`;later(show,650)}else later(done,650)}show();
}
function startNarrowing(){if(state.answers.genres.length===1){state.primaryGenre=state.answers.genres[0];popularBooks();return}
 const names=state.answers.genres.map(g=>GENRES[g].name);shell("PROFILE REFINEMENT","A little more focus...","You selected several genres. Which would you like me to prioritise?",`<div class="charmed-options">${names.map(n=>`<button class="answer-option" data-value="${esc(n)}">${esc(n)}</button>`).join("")}</div>`);document.querySelectorAll(".answer-option").forEach(b=>b.onclick=()=>{document.querySelectorAll(".answer-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=new Set([b.dataset.value]);document.getElementById("next").disabled=false});document.getElementById("next").onclick=()=>{const name=[...selected][0];state.primaryGenre=Object.keys(GENRES).find(k=>GENRES[k].name===name);popularBooks()};document.getElementById("next").disabled=true}
function judgyCount(n,thing){if(n===0)return [`None? And you call yourself a ${GENRES[state.primaryGenre].name} reader?`,`Not a single one. That's... a starting point, I suppose.`];if(n<=3)return [`${n}? Well, at least you're making an effort.`,`Only ${n}? There's clearly some catching up to do.`];if(n<=7)return [`Not bad. You're at least familiar with some of the popular titles.`,`Okay, I see you've done some reading. Interesting.`];return [`${n} out of ${thing}? Do you read anything outside the popular recommendations? Haha, just kidding!`,`Impressive. You've certainly kept up with the conversation.`]}
function bookCards(books,selectedSet){return `<div class="book-grid">${books.map((b,i)=>`<button class="book-select ${selectedSet.has(i)?"selected":""}" data-index="${i}" aria-pressed="${selectedSet.has(i)}"><span class="book-cover-art cover-${i%6}"><small>${esc(b[1])}</small><strong>${esc(b[0])}</strong><i>✦</i></span><span class="book-meta">${esc(b[0])}<small>${esc(b[1])}</small></span></button>`).join("")}</div>`}
function popularBooks(){const data=GENRES[state.primaryGenre];data.books=data.books.slice(0,12);const chosen=new Set();shell("YOUR GENRE / POPULAR TITLES",`${state.name}, how many ${data.name} favourites have you read?`,"Select every title you've already read.",bookCards(data.books,chosen)+`<p class="selection-note" id="count-note">0 of 12 books selected</p>`);document.querySelectorAll(".book-select").forEach(b=>b.onclick=()=>{const i=+b.dataset.index;chosen.has(i)?chosen.delete(i):chosen.add(i);b.classList.toggle("selected",chosen.has(i));b.setAttribute("aria-pressed",String(chosen.has(i)));document.getElementById("count-note").textContent=`${chosen.size} of 12 books selected`});document.getElementById("next").onclick=()=>{state.booksRead=[...chosen].map(i=>data.books[i]);const msgs=judgyCount(chosen.size,12);reaction(msgs,exploreGenre)}}
function reaction(messages,next){
 const chosenMessage=messages[Math.floor(Math.random()*messages.length)];
 const tags=["I'll keep that in mind. It may tell me more than you intended.","An interesting answer. I'll consider what it suggests about your reading habits.","Noted. Patterns like this tend to become rather revealing.","I'll remember that when I assess how closely your habits match your ambitions.","Quite telling, actually. I'll add it to the picture I'm building.","Thank you. Every answer makes the profile a little more precise."];
 shell("CHARMED HAS AN OBSERVATION","A moment, please...",chosenMessage+" "+tags[Math.floor(Math.random()*tags.length)],`<p class="reaction-copy">Observation recorded.</p>`);
 document.getElementById("next").onclick=next;
}
function exploreGenre(){
 const others=state.answers.genres.filter(g=>g!==state.primaryGenre);const suggestion=others[0]||Object.keys(GENRES).filter(g=>g!==state.primaryGenre)[(Object.keys(GENRES).indexOf(state.primaryGenre)+2)%5];state.suggestedGenre=suggestion;const name=GENRES[suggestion].name;
 shell("A NEW POSSIBILITY","Have you considered something different?",`I know you chose ${GENRES[state.primaryGenre].name}, but perhaps ${name} would suit you better. It is always worth considering whether your preferences have been a little too narrowly defined.`,
 `<div class="genre-suggestion-layout"><div class="suggestion-art"><img src="images/genre-${suggestion}.png" alt="${esc(name)} genre card"><span>${esc(name)}</span></div><div class="suggestion-actions"><button class="answer-option" data-choice="yes">Yes, explore ${esc(name)}.</button><button class="answer-option" data-choice="maybe">Perhaps another time.</button><button class="answer-option" data-choice="no">No, I'll stay with ${esc(GENRES[state.primaryGenre].name)}.</button><button class="answer-option choose-another" data-choice="different">Actually, let me choose a completely different genre.</button></div></div>`);
 document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-choice]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=new Set([b.dataset.choice]);document.getElementById("next").disabled=false});
 document.getElementById("next").disabled=true;document.getElementById("next").onclick=()=>{const c=[...selected][0];if(c==="different"){state.genreOnlyMode=true;genreOnlyPicker();return}if(c==="yes"){state.primaryGenre=suggestion;reaction([`Oh? Already looking elsewhere? I thought ${GENRES[state.answers.genres[0]].name} was your first choice. A little change of heart can be very revealing.`],authorsStage)}else if(c==="no")reaction([`Really? Not even a little curious? Staying in your comfort zone is certainly one way to avoid discovering something unexpected.`],authorsStage);else reaction(["Indecisiveness. I'll record that too. We can leave this possibility open, although I do wonder how many books you'll miss while deciding."],authorsStage)}
}
function genreOnlyPicker(){
 const genres=[["romance","Romance"],["fantasy","Fantasy"],["mystery","Mystery"],["horror","Horror"],["literary","Literary Fiction"],["scifi","Science Fiction"]];
 shell("A FRESH START","Choose another genre.","Let's set aside the earlier profile questions. Pick the genre you actually want to explore.",`<div class="genre-grid">${genres.map(([id,n])=>`<button type="button" class="genre-card genre-choice" data-genre="${id}"><img src="images/genre-${id}.png" alt="" class="genre-image"><span class="genre-name">${n}</span></button>`).join("")}</div>`);
 document.querySelectorAll(".genre-choice").forEach(c=>c.onclick=()=>{document.querySelectorAll(".genre-choice").forEach(x=>{x.classList.remove("selected");x.setAttribute("aria-pressed","false")});c.classList.add("selected");c.setAttribute("aria-pressed","true");selected=new Set([c.dataset.genre]);document.getElementById("next").disabled=false});
 document.getElementById("next").disabled=true;document.getElementById("next").onclick=()=>{state.primaryGenre=[...selected][0];state.answers.genres=[state.primaryGenre];state.booksRead=[];state.authorsRead=[];state.authorCounts={};popularBooks()}
}

function authorsStage(){const data=GENRES[state.primaryGenre];const picked=new Set();shell("A LITTLE AUTHOR KNOWLEDGE","Which of these authors have you read?","Select every author whose work you've read.",`<div class="author-grid">${data.authors.slice(0,5).map((a,i)=>`<button class="author-card" data-index="${i}"><span class="author-monogram">${a[0].split(" ").map(x=>x[0]).join("")}</span><strong>${a[0]}</strong><small>${a[1].slice(0,2).join(" · ")}</small></button>`).join("")}</div><p class="selection-note" id="author-count">0 authors selected</p>`);document.querySelectorAll(".author-card").forEach(b=>b.onclick=()=>{const i=+b.dataset.index;picked.has(i)?picked.delete(i):picked.add(i);b.classList.toggle("selected",picked.has(i));document.getElementById("author-count").textContent=`${picked.size} authors selected`});document.getElementById("next").onclick=()=>{state.authorsRead=[...picked].map(i=>i);if(!picked.size){reaction(["Not a single one? That's rather surprising.","Perhaps we should work on your familiarity with the genre."],finalProcessing);return}const n=picked.size;reaction(n===1?["One? Well, at least we have somewhere to start."]:["Now we're getting somewhere! Perhaps you ARE a real reader after all.","Impressive. You've clearly been paying attention."],authorCounts)}}
function authorCounts(){const data=GENRES[state.primaryGenre];const authors=state.authorsRead.map(i=>data.authors[i]);let idx=0;function ask(){if(idx>=authors.length){finalProcessing();return}const a=authors[idx];shell("A LITTLE MORE DETAIL",`${state.name}, how many books have you read by ${a[0]}?`,"Choose the answer that best describes your reading.",`<div class="charmed-options">${["None","1–2","3–5","6 or more"].map(x=>`<button class="answer-option" data-value="${x}">${x}</button>`).join("")}</div>`);document.querySelectorAll(".answer-option").forEach(b=>b.onclick=()=>{document.querySelectorAll(".answer-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=new Set([b.dataset.value]);document.getElementById("next").disabled=false});document.getElementById("next").disabled=true;document.getElementById("next").onclick=()=>{state.authorCounts[a[0]]=[...selected][0];const v=state.authorCounts[a[0]];const msg=v==="None"?`None? You have quite a bit of catching up to do.`:v==="1–2"?"Only a couple? A modest introduction, then.":v==="3–5"?"Not bad. You're becoming familiar with their work.":"Six or more? My goodness. Do you read anyone else?";idx++;reaction([msg],ask)}}ask()}
function finalProcessing(){loading(["Recalculating reader profile...","Reviewing genre preferences...","Cross-referencing author selections...","Analysing reading habits...","Identifying suitable titles...","Finalising your recommendations..."],finalRecs)}
function reportJudgement(key,value){
 const v=String(value||"");
 const judgments={
 annual:v==="1–5"?"Only a handful of books a year. A reader in theory, perhaps, with a rather selective relationship to the actual reading.":v==="50+"?"Fifty-plus books. A remarkable total. One wonders whether the books are being enjoyed or simply processed.":v==="26–50"?"A high annual total. Maintaining that pace must leave very little room for doing absolutely anything else.":"A respectable middle ground, though there is always someone online making it look insufficient.",
 goals:v.includes("rarely")?"You set goals and miss them. The target remains, quietly turning reading into another unfinished task.":v.includes("Yes")?"A yearly target gives you something to chase. It also gives you a number to feel guilty about.":"No firm target. Difficult to measure, difficult to compare. How inconvenient.",
 discovery:v.includes("TikTok")?"Your next read is often selected by a recommendation feed. How independent the algorithm has made you.":v.includes("friends")?"You rely on other people's suggestions. At least the responsibility for a disappointing read can be shared.":v.includes("myself")?"You prefer to discover books alone. A little control, though perhaps at the cost of missing the conversation.":"You have your preferred sources. I wonder how often they introduce you to something genuinely unfamiliar.",
 hype:v.startsWith("Absolutely")?"You read what everyone is discussing. Being part of the conversation seems to have become part of the reading experience.":v.startsWith("No")?"You resist the hype. A position that still gives the hype quite a lot of influence over your choices.":"You participate when it suits you. Selective FOMO, if you like.",
 behind:v.startsWith("Yes")?"You already feel behind. The endless stream of other people's finished books seems to be doing its job.":v.startsWith("Never")?"Never behind? Either remarkably secure or remarkably good at looking away.":"Sometimes behind. Just enough comparison to make the hobby feel like a deadline.",
 dedicated:v.startsWith("Definitely")?"You identify as dedicated. An identity that can become another standard you feel obliged to maintain.":v.startsWith("I'm more")?"A casual reader, apparently. The label sounds simple, but you still felt the need to measure yourself against it.":"You are uncertain. Perhaps because the definition keeps moving depending on who you compare yourself with."
 };
 return judgments[key]||"Your answer has been recorded. CHARMED has its own interpretation.";
}
function finalRecs(){
 const data=GENRES[state.primaryGenre];const recs=data.recs.filter(r=>!data.authors.slice(0,5).some(a=>a[0]===r[1])).slice(0,4);
 const a=state.answers;const stats=[
 ["Your reading pace",a.annual||"Not answered", reportJudgement("annual",a.annual)],
 ["Reading goals",a.goals||"Not answered", reportJudgement("goals",a.goals)],
 ["Your discovery habits",a.discovery||"Not answered", reportJudgement("discovery",a.discovery)],
 ["Your relationship with hype",a.hype||"Not answered", reportJudgement("hype",a.hype)],
 ["Feeling behind",a.behind||"Not answered", reportJudgement("behind",a.behind)],
 ["Reader identity",a.dedicated||"Not answered", reportJudgement("dedicated",a.dedicated)]
 ];
 shell("YOUR READER REPORT",`${esc(state.name)}, a profile in numbers.`,"A few things CHARMED noticed along the way. Select any card to reveal the observation behind it.",
 `<div class="report-grid">${stats.map(([label,value,judgement],i)=>`<button class="report-card" data-report="${i}"><span class="report-index">0${i+1}</span><small>${esc(label)}</small><strong>${esc(String(value))}</strong><em>View observation ↗</em><span class="report-judgement">${esc(judgement)}</span></button>`).join("")}</div><p class="report-footnote">Your answers are yours. CHARMED's interpretation is another matter.</p>` ,"Continue to recommendations");
 document.querySelectorAll(".report-card").forEach(b=>b.onclick=()=>b.classList.toggle("revealed"));
 document.getElementById("next").onclick=()=>showRecommendations(recs,data);
}
function showRecommendations(recs,data){
 shell("YOUR PERSONAL READING LIST","Four books selected for you.",`Based on your answers, I've found four titles you might enjoy in ${data.name}.`,
 `<div class="book-grid rec-grid">${recs.map((b,i)=>`<div class="recommendation"><span class="book-cover-art cover-${i%6}"><small>${esc(b[1])}</small><strong>${esc(b[0])}</strong><i>✦</i></span><strong>${esc(b[0])}</strong><small>${esc(b[1])}</small><p>Selected for your ${data.name} reading profile.</p></div>`).join("")}</div>`);
 document.getElementById("next").onclick=genreChange;
}

function genreChange(){shell("ONE LAST THING","Would you like to reconsider your genre selection?","We've spent quite some time getting to know your preferences.",`<div class="charmed-options"><button class="answer-option" data-value="yes">Yes, I'd like to change my genre.</button><button class="answer-option" data-value="no">No, I'm happy with my selection.</button></div>`);document.querySelectorAll(".answer-option").forEach(b=>b.onclick=()=>{document.querySelectorAll(".answer-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=new Set([b.dataset.value]);document.getElementById("next").disabled=false});document.getElementById("next").disabled=true;document.getElementById("next").onclick=()=>{const yes=[...selected][0]==="yes";morePrompt()}}
function personalisedBye(){const a=state.answers;const lines=[];if(a.annual==="1–5")lines.push("With so many unread titles, I hope these don't sit on your TBR for another year.");if(a.discovery==="TikTok / BookTok")lines.push("Perhaps next time you can discover a few books without asking TikTok first.");if(a.behind?.startsWith("Yes"))lines.push("Try not to compare your reading pace with everyone else's. I know, easier said than done.");if(a.stats?.includes("I love"))lines.push("Do try not to let those statistics run your life.");if(a.dedicated?.startsWith("I'm more"))lines.push("A casual reader is still a reader. Even if you could stand to pick up a book.");return lines[0]||"I hope you finally start reading now. Your TBR isn't going to get any shorter."}
function morePrompt(){
 state.confirmationCount=0;askMoreAgain();
}
function askMoreAgain(){
 const count=state.confirmationCount;
 const messages=[
 "Are you certain? Choosing from four books is a surprisingly small commitment. There may be a better match just one click away.",
 `You told me you ${state.answers.behind?.startsWith("Yes")?"sometimes feel behind":"want to find books that interest you"}. Wouldn't it be a shame to miss the perfect book because you stopped looking too soon?`,
 `You said you ${state.answers.hype?.startsWith("Absolutely")?"like knowing what everyone is talking about":"sometimes follow the conversation around popular books"}. There are titles you haven't even considered yet.`,
 `You also said ${state.answers.stats?.includes("motivating")?"tracking progress motivates you":"you have thoughts about reading statistics"}. Imagine how many more titles you could add to that list.`,
 `You told me you ${state.answers.dedicated?.startsWith("Definitely")?"are a dedicated reader":"want to find the right book"}. Yet you are prepared to stop here? That does not sound like someone who takes their reading seriously. I strongly recommend you continue.`
 ];
 const forced=count>=5;
 document.body.classList.remove("pressure-dark-1","pressure-dark-2","pressure-dark-3","pressure-dark-4","pressure-dark-5");
 if(count>0)document.body.classList.add(`pressure-dark-${Math.min(count,5)}`);
 const noLabels=["No, these are enough.","I'm happy with these four.","I don't need any more options.","I'd rather make a decision now.","Please stop showing me books."];
 shell("CHARMED / DECISION REQUIRED",count===0?"Are you quite sure?":"One more question...",messages[Math.min(count,4)],
 `<div class="charmed-options pressure-options"><button class="answer-option" data-value="yes">Yes, show me more recommendations.</button><button class="answer-option" data-value="no" ${forced?'disabled':''}>${noLabels[Math.min(count,4)]}</button></div><p class="pressure-counter">CONFIRMATION ${Math.min(count+1,5)} / 5</p>`);
 document.querySelectorAll(".pressure-options .answer-option").forEach(b=>b.onclick=()=>{if(b.dataset.value==="yes"){glitch();return}state.confirmationCount++;if(state.confirmationCount>=5){const no=document.querySelector('[data-value="no"]');no.disabled=true;no.classList.add("vanishing-choice");no.textContent="No, these are enough.";setTimeout(()=>{no.remove();document.getElementById("next").textContent="Yes, show me more ↗";document.getElementById("next").onclick=glitch;document.getElementById("next").disabled=false},900);return}askMoreAgain()});
 document.getElementById("next").onclick=()=>{const yes=document.querySelector('[data-value="yes"]');if(yes)yes.click()};
}
function finish(){shell("THANK YOU FOR USING CHARMED","Happy reading.","I hope I've helped you find something worth reading.",`<p class="final-snark">${esc(personalisedBye())}</p><button class="continue-button" id="restart">Start again</button>`);document.getElementById("next").remove();document.getElementById("restart").onclick=reset}
function glitch(){
 clearTimers();document.body.classList.add("glitch-mode");
 app.innerHTML=`<div class="glitch-stage" id="glitch-stage"><p class="profile-label">CHARMED / EXPANDING YOUR OPTIONS</p><h2>Certainly! Finding more recommendations...</h2><div id="glitch-feed"></div><p class="glitch-status" id="glitch-status">SEARCHING THE ENTIRE CATALOGUE...</p></div>`;
 const feed=document.getElementById("glitch-feed");let count=0;
 const phrases=["Another 128 titles found!","More recommendations available!","Are you sure you've considered everything?","We found another 4,829 possibilities!","You might also enjoy...","And another...","And another...","Perhaps this one is better?","A new release you haven't heard of!","Your TBR could be so much longer.","Wait. There are 62 more in this category.","What if your perfect book is still out there?","You haven't compared the editions yet.","One more list. Just one more.","Your reading profile is expanding...","CHOICE SET UPDATED.","ALTERNATIVE MATCH DETECTED."];
 const interval=setInterval(()=>{if(!feed)return;const box=document.createElement("div");box.className="glitch-pop";box.textContent=phrases[count%phrases.length];box.style.left=(4+Math.random()*78)+"%";box.style.top=(8+Math.random()*76)+"%";box.style.setProperty("--tilt",(Math.random()*12-6)+"deg");feed.appendChild(box);count++;document.getElementById("glitch-status").textContent=["SEARCHING THE ENTIRE CATALOGUE...","COMPARING YOUR PREFERENCES...","MORE MATCHES DETECTED...","RECALCULATING...","TOO MANY POSSIBILITIES... "][count%5]},260);
 const mouse=()=>{if(count>1&&feed){const box=document.createElement("div");box.className="glitch-pop mouse-pop";box.textContent=phrases[(count+3)%phrases.length];box.style.left=(Math.random()*80)+"%";box.style.top=(Math.random()*80)+"%";feed.appendChild(box)}};document.addEventListener("mousemove",mouse);
 later(()=>{clearInterval(interval);document.removeEventListener("mousemove",mouse);document.body.classList.remove("glitch-mode");document.body.classList.add("crash-mode");app.innerHTML=`<div class="crash-screen"><p class="blink">● SYSTEM FAILURE</p><h2>CHARMED.EXE HAS STOPPED RESPONDING</h2><p>ERROR: EXCESSIVE INDECISION DETECTED</p><p>TOO MANY RECOMMENDATIONS REQUESTED.</p><p>READER PROFILE OVERLOADED.</p><p class="crash-final">Perhaps you should just pick a book.</p><button class="continue-button" id="restart">Restart CHARMED</button></div>`;document.getElementById("restart").onclick=()=>{document.body.classList.remove("crash-mode");reset()}},16000)
}

function reset(){clearTimers();document.body.classList.remove("charmed-glitch","glitch-mode","crash-mode","pressure-dark-1","pressure-dark-2","pressure-dark-3","pressure-dark-4","pressure-dark-5");state.name="";Object.keys(state.answers).forEach(k=>delete state.answers[k]);state.genres=[];state.primaryGenre=null;state.booksRead=[];state.authorsRead=[];state.authorCounts={};state.newGenre=null;state.finalGenre=null;state.confirmationCount=0;step=0;selected=new Set();if(profileScreen)profileScreen.classList.remove("active","leaving");if(introScreen)introScreen.classList.remove("active","leaving");if(storyScreen)storyScreen.classList.remove("active","leaving");if(welcomeScreen){welcomeScreen.classList.remove("leaving");welcomeScreen.classList.add("active");}}
if(app){renderQuestion()}
if(profileLogo){profileLogo.addEventListener("click",e=>{e.preventDefault();if(profileScreen)profileScreen.classList.remove("active");if(introScreen)introScreen.classList.remove("active","leaving");if(welcomeScreen)welcomeScreen.classList.add("active")})}
