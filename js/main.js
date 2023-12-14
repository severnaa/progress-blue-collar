var gameData = {
    taskData: {},
    itemData: {},

    coins: 0,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,

    rebirthOneCount: 0,
    rebirthTwoCount: 0,

    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,
}

var tempData = {}

var skillWithLowestMaxXp = null

const autoPromoteElement = document.getElementById("autoPromote")
const autoLearnElement = document.getElementById("autoLearn")

const updateSpeed = 20

const baseLifespan = 365 * 70

const baseGameSpeed = 4

const permanentUnlocks = ["Scheduling", "Shop", "Automation", "Quick task display"]

const jobBaseData = {
    "Beggar": {name: "Beggar", maxXp: 50, income: 5},
    "Gas Station Attendant": {name: "Gas Station Attendant", maxXp: 100, income: 9},
    "Grocer": {name: "Grocer", maxXp: 200, income: 15},
    "Bartender": {name: "Bartender", maxXp: 400, income: 40},
    "Shift Manager": {name: "Shift Manager", maxXp: 800, income: 80},
    "General Manager": {name: "General Manager", maxXp: 1600, income: 150},

    "GED": {name: "GED", maxXp: 100, income: 5},
    "Apprentice": {name: "Apprentice", maxXp: 1000, income: 50},
    "Tradesman": {name: "Tradesman", maxXp: 10000, income: 120},
    "Journeyman": {name: "Journeyman", maxXp: 100000, income: 300},
    "Vetran Journeyman": {name: "Vetran Journeyman", maxXp: 1000000, income: 1000},
    "Union Journeyman": {name: "Union Journeyman", maxXp: 7500000, income: 3000},
    "Union Vetran": {name: "Union Vetran", maxXp: 40000000, income: 15000},
    "Union Lead": {name: "Union Lead", maxXp: 150000000, income: 50000},

    "Student": {name: "Student", maxXp: 100000, income: 100},
    "Intern": {name: "Intern", maxXp: 1000000, income: 1000},
    "Salary Man": {name: "Salary Man", maxXp: 10000000, income: 7500},
    "Self Employed": {name: "Self Employed", maxXp: 100000000, income: 50000},
    "Startup Owner": {name: "Startup Owner", maxXp: 10000000000, income: 250000},
    "Buisness Owner": {name: "Buisness Owner", maxXp: 1000000000000, income: 1000000},
}

const skillBaseData = {
    "Concentration": {name: "Concentration", maxXp: 100, effect: 0.01, description: "Skill xp"},
    "Productivity": {name: "Productivity", maxXp: 100, effect: 0.01, description: "Job xp"},
    "Sales": {name: "Sales", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Self Actualization": {name: "Self Actualization", maxXp: 100, effect: 0.01, description: "Happiness"},

    "Strength": {name: "Strength", maxXp: 100, effect: 0.01, description: "The Trades pay"},
    "Tool Skills": {name: "Tool Skills", maxXp: 100, effect: 0.01, description: "The Trades xp"},
    "Conditioning": {name: "Conditioning", maxXp: 100, effect: 0.01, description: "Strength xp"},

    "Money Flow": {name: "Money Flow", maxXp: 100, effect: 0.01, description: "T.A.A. xp"},
    "Generational Wealth": {name: "Generational Wealth", maxXp: 100, effect: 0.01, description: "Longer lifespan"},
    "Experience": {name: "Experience", maxXp: 100, effect: 0.01, description: "Gamespeed"},
    "Nobility": {name: "Nobility", maxXp: 100, effect: 0.01, description: "Longer lifespan"},

    "Dark influence": {name: "Dark influence", maxXp: 100, effect: 0.01, description: "All xp"},
    "Evil control": {name: "Evil control", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Intimidation": {name: "Intimidation", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Demon training": {name: "Demon training", maxXp: 100, effect: 0.01, description: "All xp"},
    "Blood meditation": {name: "Blood meditation", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Demon's wealth": {name: "Demon's wealth", maxXp: 100, effect: 0.002, description: "Job pay"},
    
}

const itemBaseData = {
    "Homeless": {name: "Homeless", expense: 0, effect: 1},
    "Tent": {name: "Tent", expense: 15, effect: 1.4},
    "Studio Apartment": {name: "Studio Apartment", expense: 100, effect: 2},
    "Single-wide": {name: "Single-wide", expense: 750, effect: 3.5},
    "Double-wide": {name: "Double-wide", expense: 3000, effect: 6},
    "Town Home": {name: "Town Home", expense: 25000, effect: 12},
    "McMansion": {name: "McMansion", expense: 300000, effect: 25},
    "Mansion": {name: "Mansion", expense: 5000000, effect: 60},

    "Journal": {name: "Journal", expense: 10, effect: 1.5, description: "Skill xp"},
    "Dumbbells": {name: "Dumbbells", expense: 50, effect: 1.5, description: "Strength xp"},
    "Personal Assistant": {name: "Personal Assistant", expense: 200, effect: 2, description: "Job xp"},
    "New Tools": {name: "New Tools", expense: 1000, effect: 2, description: "The Trades xp"},
    "Therapy": {name: "Therapy", expense: 7500, effect: 1.5, description: "Happiness"},
    "School Connections": {name: "School Connections", expense: 50000, effect: 3, description: "Magic xp"},
    "Personal Tutor": {name: "Personal Tutor", expense: 1000000, effect: 2, description: "Skill xp"},
    "Library": {name: "Library", expense: 10000000, effect: 1.5, description: "Skill xp"},
}

const jobCategories = {
    "The Grind": ["Beggar", "Gas Station Attendant", "Grocer", "Bartender", "Shift Manager", "General Manager"],
    "The Trades" : ["GED", "Apprentice", "Tradesman", "Journeyman", "Vetran Journeyman", "Union Journeyman", "Union Vetran", "Union Lead"],
    "Ownership" : ["Student", "Intern", "Salary Man", "Self Employed", "Startup Owner", "Buisness Owner"]
}

const skillCategories = {
    "Fundamentals": ["Concentration", "Productivity", "Sales", "Self Actualization"],
    "Grit": ["Strength", "Tool Skills", "Conditioning"],
    "Magic": ["Money Flow", "Generational Wealth", "Experience", "Nobility"],
    "Dark magic": ["Dark influence", "Evil control", "Intimidation", "Demon training", "Blood meditation", "Demon's wealth"]
}

const itemCategories = {
    "Properties": ["Homeless", "Tent", "Studio Apartment", "Single-wide", "Double-wide", "Town Home", "McMansion", "Mansion"],
    "Misc": ["Journal", "Dumbbells", "Personal Assistant", "New Tools", "Therapy", "School Connections", "Personal Tutor", "Library"]
}

const headerRowColors = {
    "The Grind": "#55a630",
    "The Trades": "#e63946",
    "Ownership": "#C71585",
    "Fundamentals": "#4a4e69",
    "Grit": "#ff704d",
    "Magic": "#875F9A",
    "Dark magic": "#73000f",
    "Properties": "#219ebc",
    "Misc": "#b56576",
}

const tooltips = {
    "Beggar": "Struggle day and night for a couple of dollars. You are on the brink of death each day.",
    "Gas Station Attendant": "Hang out all day at the gas station of nightmares. Tweakers and clogged toilets all day.",
    "Grocer": "Stock veggies and dry goods at a decent grocery store. Minimum wage but you don't have to do anything gross.",
    "Bartender": "Dive bar bartender. You get tipped sometimes but we average that out for you.",
    "Shift Manager": "Schedules, problem solving, and filling all the jobs at the bar that need doing.",
    "General Manager": "Not doing any of the actual work but getting the middle managment pay.",

    "GED": "Gotta do the work to get you General Education Degree before you will be allowed to do anything.",
    "Apprentice": "You gotta hold everyone elses tools, get paid next to nothing, and get pranked a lot. You learn essential trade knowlege.",
    "Tradesman": "Experienced and on your own. You can now make a living wage doing your tricks of the trade.",
    "Journeyman": "You can go anywhere, build anything, fix anything. Paid more as well.",
    "Vetran Journeyman": "You can do anything the journeyman can but much faster.",
    "Union Journeyman": "You joined the union and are now paid much more and have decent insurance.",
    "Union Vetran": "You know everyone and spend a lot of time at union meetings.",
    "Union Lead": "A leader of men. You lead the union in negotiations with the buisness owners of the world.",

    "Student": "Undergraduate student at a midle of the road university. You get a partly sum from your part time jobs.",
    "Intern": "Intern at a local institution. You are lucky to be paid. Not that it is much more than minimum. You get a lot of experience about the world of buisness",
    "Salary Man": "Every day is your job. Your job is all day. 996 is the minimum requirement. Your boss always wants more",
    "Self Employed": "You got tired working for someone else and have set out on your own. You have to do everything. Your hours are just as egregious but at least you get to keep more of the pie.",
    "Startup Owner": "You have employes and now get to focus on leading and building your customer base.",
    "Buisness Owner": "A true institution your buisness is thriving and you have good middle managment in place. You spend more time schmoozing than at the firm.",

    "Concentration": "Improve your learning speed through practising intense concentration activities.",
    "Productivity": "Learn to not be so much on the phone.",
    "Sales": "Study the tricks of the trade and persuasive skills to lower any type of expense.",
    "Self Actualization": "Fill your mind with peace and tranquility to tap into greater happiness from within.",

    "Strength": "Condition your body and strength through harsh training. Stronger individuals can get more done in a day.",
    "Tool Skills": "Learn the best techniques to use your tools efficiently.",
    "Conditioning": "Go for a jog once in a while. You will be able to get stronger if you can walk across the gym without needing to catch your breath.",

    "Money Flow": "Poop in poop out. Gotta get paid and pay up. Learn to take a bit off the top.",
    "Generational Wealth": "Pass your wealth down to the next generation",
    "Experience": "Bend space and time through being jaded and drunk, resulting in a faster gamespeed.",
    "Nobility": "Through harnessing being truely rich your political wake survives through the generation. The next generation gets even more wealth",

    "Dark influence": "Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
    "Evil control": "Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
    "Intimidation": "Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
    "Demon training": "A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
    "Blood meditation": "Grow and culture the evil within you through the sacrifise of other living beings, drastically increasing evil gain.",
    "Demon's wealth": "Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",

    "Homeless": "Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
    "Tent": "You stole a tent from REI. At least you have something.",
    "Studio Apartment": "Barely enough room to turn around. But at least the toilet mostly works.",
    "Single-wide": "Your own place, tiny and falling apart but your own.",
    "Double-wide": "Double the size of a single wide. Thats it.",
    "Town Home": "Lots of stairs but a nice place overall. Comes with a hefty price tag.",
    "McMansion": "Everyone elses house in the neighborhood looks the same. But thats okay, very nice digs",
    "Mansion": "Custom designed for a ludicrous price. This mansion excedes your wildest dreams and is the talk of the town.",

    "Journal": "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
    "Dumbbells": "Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before. ",
    "Personal Assistant": "Assists you in completing day to day activities, giving you more time to be productive at work.",
    "New Tools": "The newest line of tools. Nothing broken, everything always works.",
    "Therapy": "Deal with your issues. Become a happier person without your deamons holding you down, as much...",
    "School Connections": "Your friends from school are in high places making schmoozing with the elite much easier.",
    "Personal Tutor": "A savant comes and teaches you the ways. Allowing you to super speed your studies.",
    "Library": "Stores a collection of books, each containing vast amounts of information from basic life skills to how to run a buisness empire.",
}

const units = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc"];

const jobTabButton = document.getElementById("jobTabButton")

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
  
function getBindedTaskEffect(taskName) {
    var task = gameData.taskData[taskName]
    return task.getEffect.bind(task)
}

function getBindedItemEffect(itemName) {
    var item = gameData.itemData[itemName]
    return item.getEffect.bind(item)
}

function addMultipliers() {
    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getBindedTaskEffect("Dark influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon training"))

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's wealth"))
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
            task.xpMultipliers.push(getBindedItemEffect("Personal Assistant"))    
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Journal"))
            task.xpMultipliers.push(getBindedItemEffect("Personal Tutor"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
        }

        if (jobCategories["The Trades"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Tool Skills"))
            task.xpMultipliers.push(getBindedItemEffect("New Tools"))
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Conditioning"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Magic"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("School Connections"))
        } else if (jobCategories["Ownership"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Money Flow"))
        } else if (skillCategories["Dark magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvil)
        }
    }

    for (itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Sales"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
    }
}

function setCustomEffects() {
    var sales = gameData.taskData["Sales"]
    sales.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, sales.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var intimidation = gameData.taskData["Intimidation"]
    intimidation.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var timeWarping = gameData.taskData["Experience"]
    timeWarping.getEffect = function() {
        var multiplier = 1 + getBaseLog(13, timeWarping.level + 1) 
        return multiplier
    }

    var genWealth = gameData.taskData["Generational Wealth"]
    genWealth.getEffect = function() {
        var multiplier = 1 + getBaseLog(33, genWealth.level + 1) 
        return multiplier
    }
}

function getHappiness() {
    var meditationEffect = getBindedTaskEffect("Self Actualization")
    var therapyEffect = getBindedItemEffect("Therapy")
    var happiness = meditationEffect() * therapyEffect() * gameData.currentProperty.getEffect()
    return happiness
}

function getEvil() {
    return gameData.evil
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1
    multipliers.forEach(function(multiplierFunction) {
        var multiplier = multiplierFunction()
        finalMultiplier *= multiplier
    })
    var finalValue = Math.round(value * finalMultiplier)
    return finalValue
}

function applySpeed(value) {
    finalValue = value * getGameSpeed() / updateSpeed
    return finalValue
}

function getEvilGain() {
    var evilControl = gameData.taskData["Evil control"]
    var bloodMeditation = gameData.taskData["Blood meditation"]
    var evil = evilControl.getEffect() * bloodMeditation.getEffect()
    return evil
}

function getGameSpeed() {
    var experience = gameData.taskData["Experience"]
    var timeWarpingSpeed = gameData.timeWarpingEnabled ? experience.getEffect() : 1
    var gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed
    return gameSpeed
}

function applyExpenses() {
    var coins = applySpeed(getExpense())
    gameData.coins -= coins
    if (gameData.coins < 0) {    
        goBankrupt()
    }
}

function getExpense() {
    var expense = 0
    expense += gameData.currentProperty.getExpense()
    for (misc of gameData.currentMisc) {
        expense += misc.getExpense()
    }
    return expense
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
}

function setTab(element, selectedTab) {

    var tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    })
    document.getElementById(selectedTab).style.display = "block"

    var tabButtons = document.getElementsByClassName("tabButton")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    element.classList.add("w3-blue-gray")
}

function setPause() {
    gameData.paused = !gameData.paused
}

function setTimeWarping() {
    gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled
}

function setTask(taskName) {
    var task = gameData.taskData[taskName]
    task instanceof Job ? gameData.currentJob = task : gameData.currentSkill = task
}

function setProperty(propertyName) {
    var property = gameData.itemData[propertyName]
    gameData.currentProperty = property
}

function setMisc(miscName) {
    var misc = gameData.itemData[miscName]
    if (gameData.currentMisc.includes(misc)) {
        for (i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createData(data, baseData) {
    for (key in baseData) {
        var entity = baseData[key]
        createEntity(data, entity)
    }
}

function createEntity(data, entity) {
    if ("income" in entity) {data[entity.name] = new Job(entity)}
    else if ("maxXp" in entity) {data[entity.name] = new Skill(entity)}
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function createRequiredRow(categoryName) {
    var requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true)
    requiredRow.classList.add("requiredRow")
    requiredRow.classList.add(removeSpaces(categoryName))
    requiredRow.id = categoryName
    return requiredRow
}

function createHeaderRow(templates, categoryType, categoryName) {
    var headerRow = templates.headerRow.content.firstElementChild.cloneNode(true)
    headerRow.getElementsByClassName("category")[0].textContent = categoryName
    if (categoryType != itemCategories) {
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "Income/day" : "Effect"
    }

    headerRow.style.backgroundColor = headerRowColors[categoryName]
    headerRow.style.color = "#ffffff"
    headerRow.classList.add(removeSpaces(categoryName))
    headerRow.classList.add("headerRow")
    
    return headerRow
}

function createRow(templates, name, categoryName, categoryType) {
    var row = templates.row.content.firstElementChild.cloneNode(true)
    row.getElementsByClassName("name")[0].textContent = name
    row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name]
    row.id = "row " + name
    if (categoryType != itemCategories) {
        row.getElementsByClassName("progressBar")[0].onclick = function() {setTask(name)}
    } else {
        row.getElementsByClassName("button")[0].onclick = categoryName == "Properties" ? function() {setProperty(name)} : function() {setMisc(name)}
    }

    return row
}

function createAllRows(categoryType, tableId) {
    var templates = {
        headerRow: document.getElementsByClassName(categoryType == itemCategories ? "headerRowItemTemplate" : "headerRowTaskTemplate")[0],
        row: document.getElementsByClassName(categoryType == itemCategories ? "rowItemTemplate" : "rowTaskTemplate")[0],
    }

    var table = document.getElementById(tableId)

    for (categoryName in categoryType) {
        var headerRow = createHeaderRow(templates, categoryType, categoryName)
        table.appendChild(headerRow)
        
        var category = categoryType[categoryName]
        category.forEach(function(name) {
            var row = createRow(templates, name, categoryName, categoryType)
            table.appendChild(row)       
        })

        var requiredRow = createRequiredRow(categoryName)
        table.append(requiredRow)
    }
}

function updateQuickTaskDisplay(taskType) {
    var currentTask = taskType == "job" ? gameData.currentJob : gameData.currentSkill
    var quickTaskDisplayElement = document.getElementById("quickTaskDisplay")
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0]
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " lvl " + currentTask.level
    progressBar.getElementsByClassName("progressFill")[0].style.width = currentTask.xp / currentTask.getMaxXp() * 100 + "%"
}

function updateRequiredRows(data, categoryType) {
    var requiredRows = document.getElementsByClassName("requiredRow")
    for (requiredRow of requiredRows) {
        var nextEntity = null
        var category = categoryType[requiredRow.id] 
        if (category == null) {continue}
        for (i = 0; i < category.length; i++) {
            var entityName = category[i]
            if (i >= category.length - 1) break
            var requirements = gameData.requirements[entityName]
            if (requirements && i == 0) {
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName]
                    break
                }
            }

            var nextIndex = i + 1
            if (nextIndex >= category.length) {break}
            var nextEntityName = category[nextIndex]
            nextEntityRequirements = gameData.requirements[nextEntityName]

            if (!nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName]
                break
            }       
        }

        if (nextEntity == null) {
            requiredRow.classList.add("hiddenTask")           
        } else {
            requiredRow.classList.remove("hiddenTask")
            var requirementObject = gameData.requirements[nextEntity.name]
            var requirements = requirementObject.requirements

            var coinElement = requiredRow.getElementsByClassName("coins")[0]
            var levelElement = requiredRow.getElementsByClassName("levels")[0]
            var evilElement = requiredRow.getElementsByClassName("evil")[0]

            coinElement.classList.add("hiddenTask")
            levelElement.classList.add("hiddenTask")
            evilElement.classList.add("hiddenTask")

            var finalText = ""
            if (data == gameData.taskData) {
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove("hiddenTask")
                    evilElement.textContent = format(requirements[0].requirement) + " evil"
                } else {
                    levelElement.classList.remove("hiddenTask")
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task]
                        if (task.level >= requirement.requirement) continue
                        var text = " " + requirement.task + " level " + format(task.level) + "/" + format(requirement.requirement) + ","
                        finalText += text
                    }
                    finalText = finalText.substring(0, finalText.length - 1)
                    levelElement.textContent = finalText
                }
            } else if (data == gameData.itemData) {
                coinElement.classList.remove("hiddenTask")
                formatCoins(requirements[0].requirement, coinElement)
            }
        }   
    }
}

function updateTaskRows() {
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        var row = document.getElementById("row " + task.name)
        row.getElementsByClassName("level")[0].textContent = task.level
        row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain())
        row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft())

        var maxLevel = row.getElementsByClassName("maxLevel")[0]
        maxLevel.textContent = task.maxLevel
        gameData.rebirthOneCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden")

        var progressFill = row.getElementsByClassName("progressFill")[0]
        progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
        task == gameData.currentJob || task == gameData.currentSkill ? progressFill.classList.add("current") : progressFill.classList.remove("current")

        var valueElement = row.getElementsByClassName("value")[0]
        valueElement.getElementsByClassName("income")[0].style.display = task instanceof Job
        valueElement.getElementsByClassName("effect")[0].style.display = task instanceof Skill

        var skipSkillElement = row.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = task instanceof Skill && autoLearnElement.checked ? "block" : "none"

        if (task instanceof Job) {
            formatCoins(task.getIncome(), valueElement.getElementsByClassName("income")[0])
        } else {
            valueElement.getElementsByClassName("effect")[0].textContent = task.getEffectDescription()
        }
    }
}

function updateItemRows() {
    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        var row = document.getElementById("row " + item.name)
        var button = row.getElementsByClassName("button")[0]
        button.disabled = gameData.coins < item.getExpense()
        var active = row.getElementsByClassName("active")[0]
        var color = itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties"] : headerRowColors["Misc"]
        active.style.backgroundColor = gameData.currentMisc.includes(item) || item == gameData.currentProperty ? color : "white"
        row.getElementsByClassName("effect")[0].textContent = item.getEffectDescription()
        formatCoins(item.getExpense(), row.getElementsByClassName("expense")[0])
    }
}

function updateHeaderRows(categories) {
    for (categoryName in categories) {
        var className = removeSpaces(categoryName)
        var headerRow = document.getElementsByClassName(className)[0]
        var maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0]
        gameData.rebirthOneCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
        var skipSkillElement = headerRow.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = categories == skillCategories && autoLearnElement.checked ? "block" : "none"
    }
}

function updateText() {
    //Sidebar
    document.getElementById("ageDisplay").textContent = daysToYears(gameData.days)
    document.getElementById("dayDisplay").textContent = getDay()
    document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan())
    document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause"

    formatCoins(gameData.coins, document.getElementById("coinDisplay"))
    setSignDisplay()
    formatCoins(getNet(), document.getElementById("netDisplay"))
    formatCoins(getIncome(), document.getElementById("incomeDisplay"))
    formatCoins(getExpense(), document.getElementById("expenseDisplay"))

    document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1)

    document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1)
    document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1)

    document.getElementById("timeWarpingDisplay").textContent = "x" + gameData.taskData["Experience"].getEffect().toFixed(2)
    document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "Disable warp" : "Enable warp"
}

function setSignDisplay() {
    var signDisplay = document.getElementById("signDisplay")
    if (getIncome() > getExpense()) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else if (getExpense() > getIncome()) {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    } else {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    }
}

function getNet() {
    var net = Math.abs(getIncome() - getExpense())
    return net
}

function hideEntities() {
    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        var completed = requirement.isCompleted()
        for (element of requirement.elements) {
            if (completed) {
                element.classList.remove("hidden")
            } else {
                element.classList.add("hidden")
            }
        }
    }
}

function createItemData(baseData) {
    for (var item of baseData) {
        gameData.itemData[item.name] = "happiness" in item ? new Property(task) : new Misc(task)
        gameData.itemData[item.name].id = "item " + item.name
    }
}

function doCurrentTask(task) {
    task.increaseXp()
    if (task instanceof Job) {
        increaseCoins()
    }
}

function getIncome() {
    var income = 0
    income += gameData.currentJob.getIncome()
    return income
}

function increaseCoins() {
    var coins = applySpeed(getIncome())
    gameData.coins += coins
}

function daysToYears(days) {
    var years = Math.floor(days / 365)
    return years
}

function getCategoryFromEntityName(categoryType, entityName) {
    for (categoryName in categoryType) {
        var category = categoryType[categoryName]
        if (category.includes(entityName)) {
            return category
        }
    }
}

function getNextEntity(data, categoryType, entityName) {
    var category = getCategoryFromEntityName(categoryType, entityName)
    var nextIndex = category.indexOf(entityName) + 1
    if (nextIndex > category.length - 1) return null
    var nextEntityName = category[nextIndex]
    var nextEntity = data[nextEntityName]
    return nextEntity
}

function autoPromote() {
    if (!autoPromoteElement.checked) return
    var nextEntity = getNextEntity(gameData.taskData, jobCategories, gameData.currentJob.name)
    if (nextEntity == null) return
    var requirement = gameData.requirements[nextEntity.name]
    if (requirement.isCompleted()) gameData.currentJob = nextEntity
}

function checkSkillSkipped(skill) {
    var row = document.getElementById("row " + skill.name)
    var isSkillSkipped = row.getElementsByClassName("checkbox")[0].checked
    return isSkillSkipped
}

function setSkillWithLowestMaxXp() {
    var xpDict = {}

    for (skillName in gameData.taskData) {
        var skill = gameData.taskData[skillName]
        var requirement = gameData.requirements[skillName]
        if (skill instanceof Skill && requirement.isCompleted() && !checkSkillSkipped(skill)) {
            xpDict[skill.name] = skill.level //skill.getMaxXp() / skill.getXpGain()
        }
    }

    if (xpDict == {}) {
        skillWithLowestMaxXp = gameData.taskData["Concentration"]
        return
    }

    var skillName = getKeyOfLowestValueFromDict(xpDict)
    skillWithLowestMaxXp = gameData.taskData[skillName]
}

function getKeyOfLowestValueFromDict(dict) {
    var values = []
    for (key in dict) {
        var value = dict[key]
        values.push(value)
    }

    values.sort(function(a, b){return a - b})

    for (key in dict) {
        var value = dict[key]
        if (value == values[0]) {
            return key
        }
    }
}

function autoLearn() {
    if (!autoLearnElement.checked || !skillWithLowestMaxXp) return
    gameData.currentSkill = skillWithLowestMaxXp
}

function yearsToDays(years) {
    var days = years * 365
    return days
}
 
function getDay() {
    var day = Math.floor(gameData.days - daysToYears(gameData.days) * 365)
    return day
}

function increaseDays() {
    var increase = applySpeed(1)
    gameData.days += increase
}

function format(number) {

    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = units[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

function formatCoins(coins, element) {
    var tiers = ["p", "g", "s"]
    var colors = {
        "p": "#79b9c7",
        "g": "#E5C100",
        "s": "#a8a8a8",
        "c": "#a15c2f"
    }
    var leftOver = coins
    var i = 0
    for (tier of tiers) {
        var x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2))
        var leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2))
        var text = format(String(x)) + tier + " "
        element.children[i].textContent = x > 0 ? text : ""
        element.children[i].style.color = colors[tier]
        i += 1
    }
    if (leftOver == 0 && coins > 0) {element.children[3].textContent = ""; return}
    var text = String(Math.floor(leftOver)) + "c"
    element.children[3].textContent = text
    element.children[3].style.color = colors["c"]
}

function getTaskElement(taskName) {
    var task = gameData.taskData[taskName]
    var element = document.getElementById(task.id)
    return element
}

function getItemElement(itemName) {
    var item = gameData.itemData[itemName]
    var element = document.getElementById(item.id)
    return element
}

function getElementsByClass(className) {
    var elements = document.getElementsByClassName(removeSpaces(className))
    return elements
}

function setLightDarkMode() {
    var body = document.getElementById("body")
    body.classList.contains("dark") ? body.classList.remove("dark") : body.classList.add("dark")
}

function removeSpaces(string) {
    var string = string.replace(/ /g, "")
    return string
}

function rebirthOne() {
    gameData.rebirthOneCount += 1

    rebirthReset()
}

function rebirthTwo() {
    gameData.rebirthTwoCount += 1
    gameData.evil += getEvilGain()

    rebirthReset()

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        task.maxLevel = 0
    }    
}

function rebirthReset() {
    setTab(jobTabButton, "jobs")

    gameData.coins = 0
    gameData.days = 365 * 14
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentSkill = gameData.taskData["Concentration"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        if (task.level > task.maxLevel) task.maxLevel = task.level
        task.level = 0
        task.xp = 0
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.completed && permanentUnlocks.includes(key)) continue
        requirement.completed = false
    }
}

function getLifespan() {
    var generationalWealth = gameData.taskData["Generational Wealth"]
    var nobility = gameData.taskData["Nobility"]
    var lifespan = baseLifespan * generationalWealth.getEffect() * nobility.getEffect()
    return lifespan
}

function isAlive() {
    var condition = gameData.days < getLifespan()
    var deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition
}

function assignMethods() {

    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)
            
        } else {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        } 
        gameData.taskData[key] = task
    }

    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        item.baseData = itemBaseData[item.name]
        item = Object.assign(new Item(itemBaseData[item.name]), item)
        gameData.itemData[key] = item
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement)
        }

        var tempRequirement = tempData["requirements"][key]
        requirement.elements = tempRequirement.elements
        requirement.requirements = tempRequirement.requirements
        gameData.requirements[key] = requirement
    }

    gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    gameData.currentSkill = gameData.taskData[gameData.currentSkill.name]
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    var newArray = []
    for (misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
        }
    }

    for (key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function loadGameData() {
    var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

    if (gameDataSave !== null) {
        replaceSaveDict(gameData, gameDataSave)
        replaceSaveDict(gameData.requirements, gameDataSave.requirements)
        replaceSaveDict(gameData.taskData, gameDataSave.taskData)
        replaceSaveDict(gameData.itemData, gameDataSave.itemData)

        gameData = gameDataSave
    }

    assignMethods()
}

function updateUI() {
    updateTaskRows()
    updateItemRows()
    updateRequiredRows(gameData.taskData, jobCategories)
    updateRequiredRows(gameData.taskData, skillCategories)
    updateRequiredRows(gameData.itemData, itemCategories)
    updateHeaderRows(jobCategories)
    updateHeaderRows(skillCategories)
    updateQuickTaskDisplay("job")
    updateQuickTaskDisplay("skill")
    hideEntities()
    updateText()  
}

function update() {
    increaseDays()
    autoPromote()
    autoLearn()
    doCurrentTask(gameData.currentJob)
    doCurrentTask(gameData.currentSkill)
    applyExpenses()
    updateUI()
}

function resetGameData() {
    localStorage.clear()
    location.reload()
}

function importGameData() {
    var importExportBox = document.getElementById("importExportBox")
    var data = JSON.parse(window.atob(importExportBox.value))
    gameData = data
    saveGameData()
    location.reload()
}

function exportGameData() {
    var importExportBox = document.getElementById("importExportBox")
    importExportBox.value = window.btoa(JSON.stringify(gameData))
}

//Init

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable") 

createData(gameData.taskData, jobBaseData)
createData(gameData.taskData, skillBaseData)
createData(gameData.itemData, itemBaseData) 

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentSkill = gameData.taskData["Concentration"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = {
    //Other
    "Ownership": new TaskRequirement(getElementsByClass("Ownership"), [{task: "Concentration", requirement: 200}, {task: "Self Actualization", requirement: 200}]),
    "Dark magic": new EvilRequirement(getElementsByClass("Dark magic"), [{requirement: 1}]),
    "Shop": new CoinRequirement([document.getElementById("shopTabButton")], [{requirement: gameData.itemData["Tent"].getExpense() * 50}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
    "Time warping info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "Salary Man", requirement: 10}]),
    "Automation": new AgeRequirement([document.getElementById("automation")], [{requirement: 20}]),
    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    //The Grind
    "Beggar": new TaskRequirement([getTaskElement("Beggar")], []),
    "Gas Station Attendant": new TaskRequirement([getTaskElement("Gas Station Attendant")], [{task: "Beggar", requirement: 10}]),
    "Grocer": new TaskRequirement([getTaskElement("Grocer")], [{task: "Gas Station Attendant", requirement: 10}]),
    "Bartender": new TaskRequirement([getTaskElement("Bartender")], [{task: "Strength", requirement: 10}, {task: "Grocer", requirement: 10}]),
    "Shift Manager": new TaskRequirement([getTaskElement("Shift Manager")], [{task: "Strength", requirement: 30}, {task: "Bartender", requirement: 10}]),
    "General Manager": new TaskRequirement([getTaskElement("General Manager")], [{task: "Sales", requirement: 50}, {task: "Shift Manager", requirement: 10}]),

    //The Trades 
    "GED": new TaskRequirement([getTaskElement("GED")], [{task: "Strength", requirement: 5}]),
    "Apprentice": new TaskRequirement([getTaskElement("Apprentice")], [{task: "Strength", requirement: 20}, {task: "GED", requirement: 10}]),
    "Tradesman": new TaskRequirement([getTaskElement("Tradesman")], [{task: "Tool Skills", requirement: 40}, {task: "Apprentice", requirement: 10}]),
    "Journeyman": new TaskRequirement([getTaskElement("Journeyman")], [{task: "Strength", requirement: 100}, {task: "Tradesman", requirement: 10}]),
    "Vetran Journeyman": new TaskRequirement([getTaskElement("Vetran Journeyman")], [{task: "Tool Skills", requirement: 150}, {task: "Journeyman", requirement: 10}]),
    "Union Journeyman": new TaskRequirement([getTaskElement("Union Journeyman")], [{task: "Strength", requirement: 300}, {task: "Vetran Journeyman", requirement: 10}]),
    "Union Vetran": new TaskRequirement([getTaskElement("Union Vetran")], [{task: "Money Flow", requirement: 500}, {task: "Union Journeyman", requirement: 10}]),
    "Union Lead": new TaskRequirement([getTaskElement("Union Lead")], [{task: "Money Flow", requirement: 1000}, {task: "Tool Skills", requirement: 1000}, {task: "Union Vetran", requirement: 10}]),

    //Ownership
    "Student": new TaskRequirement([getTaskElement("Student")], [{task: "Concentration", requirement: 200}, {task: "Self Actualization", requirement: 200}]),
    "Intern": new TaskRequirement([getTaskElement("Intern")], [{task: "Money Flow", requirement: 400}, {task: "Student", requirement: 10}]),
    "Salary Man": new TaskRequirement([getTaskElement("Salary Man")], [{task: "Money Flow", requirement: 700}, {task: "Intern", requirement: 10}]),
    "Self Employed": new TaskRequirement([getTaskElement("Self Employed")], [{task: "Money Flow", requirement: 1000}, {task: "Salary Man", requirement: 10}]),
    "Startup Owner": new TaskRequirement([getTaskElement("Startup Owner")], [{task: "Money Flow", requirement: 1500}, {task: "Self Employed", requirement: 10}]),
    "Buisness Owner": new TaskRequirement([getTaskElement("Buisness Owner")], [{task: "Money Flow", requirement: 2000}, {task: "Startup Owner", requirement: 10}]),

    //Fundamentals
    "Concentration": new TaskRequirement([getTaskElement("Concentration")], []),
    "Productivity": new TaskRequirement([getTaskElement("Productivity")], [{task: "Concentration", requirement: 5}]),
    "Sales": new TaskRequirement([getTaskElement("Sales")], [{task: "Concentration", requirement: 20}]),
    "Self Actualization": new TaskRequirement([getTaskElement("Self Actualization")], [{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),

    //The Trades
    "Strength": new TaskRequirement([getTaskElement("Strength")], []),
    "Tool Skills": new TaskRequirement([getTaskElement("Tool Skills")], [{task: "Concentration", requirement: 20}]),
    "Conditioning": new TaskRequirement([getTaskElement("Conditioning")], [{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),

    //Managment
    "Money Flow": new TaskRequirement([getTaskElement("Money Flow")], [{task: "Concentration", requirement: 200}, {task: "Self Actualization", requirement: 200}]),
    "Generational Wealth": new TaskRequirement([getTaskElement("Generational Wealth")], [{task: "Intern", requirement: 10}]),
    "Experience": new TaskRequirement([getTaskElement("Experience")], [{task: "Salary Man", requirement: 10}]),
    "Nobility": new TaskRequirement([getTaskElement("Nobility")], [{task: "Buisness Owner", requirement: 1000}]),

    //Dark magic
    "Dark influence": new EvilRequirement([getTaskElement("Dark influence")], [{requirement: 1}]),
    "Evil control": new EvilRequirement([getTaskElement("Evil control")], [{requirement: 1}]),
    "Intimidation": new EvilRequirement([getTaskElement("Intimidation")], [{requirement: 1}]),
    "Demon training": new EvilRequirement([getTaskElement("Demon training")], [{requirement: 25}]),
    "Blood meditation": new EvilRequirement([getTaskElement("Blood meditation")], [{requirement: 75}]),
    "Demon's wealth": new EvilRequirement([getTaskElement("Demon's wealth")], [{requirement: 500}]),

    //Properties
    "Homeless": new CoinRequirement([getItemElement("Homeless")], [{requirement: 0}]),
    "Tent": new CoinRequirement([getItemElement("Tent")], [{requirement: 0}]),
    "Studio Apartment": new CoinRequirement([getItemElement("Studio Apartment")], [{requirement: gameData.itemData["Studio Apartment"].getExpense() * 100}]),
    "Single-wide": new CoinRequirement([getItemElement("Single-wide")], [{requirement: gameData.itemData["Single-wide"].getExpense() * 100}]),
    "Double-wide": new CoinRequirement([getItemElement("Double-wide")], [{requirement: gameData.itemData["Double-wide"].getExpense() * 100}]),
    "Town Home": new CoinRequirement([getItemElement("Town Home")], [{requirement: gameData.itemData["Town Home"].getExpense() * 100}]),
    "McMansion": new CoinRequirement([getItemElement("McMansion")], [{requirement: gameData.itemData["McMansion"].getExpense() * 100}]),
    "Mansion": new CoinRequirement([getItemElement("Mansion")], [{requirement: gameData.itemData["Mansion"].getExpense() * 100}]),

    //Misc
    "Journal": new CoinRequirement([getItemElement("Journal")], [{requirement: 0}]),
    "Dumbbells": new CoinRequirement([getItemElement("Dumbbells")], [{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
    "Personal Assistant": new CoinRequirement([getItemElement("Personal Assistant")], [{requirement: gameData.itemData["Personal Assistant"].getExpense() * 100}]),
    "New Tools": new CoinRequirement([getItemElement("New Tools")], [{requirement: gameData.itemData["New Tools"].getExpense() * 100}]),
    "Therapy": new CoinRequirement([getItemElement("Therapy")], [{requirement: gameData.itemData["Therapy"].getExpense() * 100}]),
    "School Connections": new CoinRequirement([getItemElement("School Connections")], [{requirement: gameData.itemData["School Connections"].getExpense() * 100}]),
    "Personal Tutor": new CoinRequirement([getItemElement("Personal Tutor")], [{requirement: gameData.itemData["Personal Tutor"].getExpense() * 100}]),
    "Library": new CoinRequirement([getItemElement("Library")], [{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
}

tempData["requirements"] = {}
for (key in gameData.requirements) {
    var requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

setCustomEffects()
addMultipliers()

setTab(jobTabButton, "jobs")

update()
setInterval(update, 1000 / updateSpeed)
setInterval(saveGameData, 3000)
setInterval(setSkillWithLowestMaxXp, 1000)