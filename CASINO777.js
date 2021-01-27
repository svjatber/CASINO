

// HOW TO USE THIS CODE
// -  create new SuperAdmin; example: const admin = new SuperAdmin("string": name of SuperAdmin, number: amount of money at began)
// -  create new Casino using method createCasino(); example:admin.createCasino("name": name of Casino);
// - create new GameMachine using method createGameMachine(); example:admin.createGameMachine("withdrawMoney": money that you have when machine was created)
// You can create as many GameMachines as you want;
// - delete GameMachine using method  deleteGameMachine(); example: admin.deleteGameMachine(index: number of Machine);
// - add money to Casino using method  addMoneyToGameMachine() ; example: admin.addMoneyToGameMachine(money: amount of money, index: number of Machine);
// - take out money from Casino using method takeMoneyFromCasino(); example.takeMoneyFromCasino(sumOfMoney: amount of money that getting from Casino);
// - create new User; example: const user = new User ("string": name of User, money: amount of money that have user);
// - play game as User using method playGameInUser(){; example: user.playGameInUser(money:bet, superAdmin: admin, indexMachine: number of Machine on which you want play);
// - play game as SuperAdmin using method playGameInUser(){; example: admin.playGameInUser(money:bet, superAdmin: admin, indexMachine: number of Machine on which you want play);


//Functions, which use
const IsIndexInGameMachine = (arr, index) =>{
    let value = false
    for (let i =0; i < arr.length; i++){
        if(i === index){
            value = true
        }
    }
    return value
}
const playGameFunc = () => {
    let numLucky = [];
    for (let i = 0; i <= 2; i++) {
        numLucky.push(Math.floor(Math.random() * 10))
    }
    let getNumberOfDuplicateItems = arr => arr.length - [...new Set(arr)].length
    let Items = getNumberOfDuplicateItems(numLucky)
    if (Items === 2) {
        return {coefGameMachine: 3, numLucky: numLucky.join('')}
    } else if (Items === 1) {
        return {coefGameMachine: 2, numLucky: numLucky.join('')}
    } else {
        return {coefGameMachine: false, numLucky: numLucky.join('')}
    }
}

// User
class User {
    constructor(name, money) {
        if(money > 0) { // check if money more than 0
            console.info('YOU CREATED USER')
            this.name = name
            this.money = money
            }
        }

    playGame(money, superAdmin, indexMachine){ // PLAY GAME
        if(this.money !== 0 || this.money >= money){ // check if money more than 0 and users balance more than bet
            let isIndex = IsIndexInGameMachine(superAdmin.casinoGetter.gameMachinesGetter, indexMachine)
            if(isIndex){
                if( money > 0){ // check if money more than 0
                    this.money -= money
                    if(money * 3 <= superAdmin.casinoGetter.gameMachinesGetter[indexMachine].money){ // check if you win at a GameMachine, but there is no enough credit balance, you will not get pay
                        const result = superAdmin.casinoGetter.gameMachinesGetter[indexMachine].playGameMachine(money);
                        this.money += result
                    }else {
                        console.error(`If you win at a GameMachine, but there is no enough credit balance, you will not get pay, Please set at mount in rage 1..${superAdmin.casinoGetter.gameMachinesGetter[indexMachine].money/3}`)
                        this.money += money
                    }
                }else{
                    console.error('Set amount money more than 0');
                }
            }else{
                console.error('This index does not exist')
            }
        } else{
            console.error('Not enough money that play')
        }

    }

}

// SuperAdmin
class SuperAdmin extends User{
    constructor(money) {
        super(money);
        this.money = money
        this._casino = null

    }
    get casinoGetter(){
        return this._casino
    }
    set casinoSetter(value){
        this._casino = value
    }
    createCasino(name) { // METHOD THAT CREATE CASINO
        if(name){
            this.casinoSetter = new Casino(name)
        }else{
            console.error('Please, enter name')
        }
    }

    createGameMachine(withdrawMoney) {  // METHOD THAT CREATE  GAME MACHINE
        if (this.casinoGetter) { // check if Casino exist
                if (withdrawMoney < this.money ) { // check if game machine balance is less then SuperAdmin
                    if(withdrawMoney > 0){ // check if money more than 0
                        this.money -= withdrawMoney
                        this.casinoGetter.createGameMachineInCasino(withdrawMoney)
                    }else {
                        console.error("Set amount money more 0")
                    }
                }else{
                    console.error("Unfortunately, you don't have enough money to create a Game Machine ")
                }
        }else {
            console.error('Please, create Casino')
        }
    }

    takeMoneyFromCasino(sumOfMoney) { // TAKE MONEY FROM CASINO
        if(this.casinoGetter && this.casinoGetter.gameMachinesGetter.length > 0){ // check if Casino and Game Machines exist
            if(sumOfMoney > 0){ // check if money more than 0
                if (this.casinoGetter.checkAllMoneyInMachines >= sumOfMoney) { // check if casino balance is less then SuperAdmin
                    let gameMachinesSort = this.casinoGetter.gameMachinesGetter.sort((a, b) => b.money - a.money)
                    let neededSum = sumOfMoney
                    let withdrawnMoneyFromMachines = 0
                    let i = 0
                    while (neededSum > 0) {
                        let withdrawnMoney = +gameMachinesSort[i].withdrawMoney(neededSum)
                        if (neededSum === withdrawnMoney) {
                            withdrawnMoneyFromMachines += withdrawnMoney
                            break
                        } else {
                            neededSum -= withdrawnMoney
                            withdrawnMoneyFromMachines += withdrawnMoney
                            i++
                        }
                    }
                    this.money += withdrawnMoneyFromMachines
                }else{
                    console.error("Unfortunately, in machine not enough money")
                    this.money += 0
                }
            }else{
                console.error("Set amount money more 0")
            }
        }else{
            console.error('Please, create Casino or GameMachine')

        }
    }

    addMoneyToGameMachine(money, index) { // METHOD THAT ADD MONEY TO GAME MACHINE
        if (this.casinoGetter) { // check if Casino exist
            let isIndex = IsIndexInGameMachine(this.casinoGetter.gameMachinesGetter, index)
            if(isIndex){  // check if Game Machine exist
                if (money > 0) {
                    if (this.money >= money) { // check if SuperAdmin balance less top-up
                        this.money -= money
                        this.casinoGetter.gameMachinesGetter[index].addMoneyGameMachine(money)
                    } else {
                        console.error('Not enough money in Admin');
                    }
                } else {
                    console.error("Set amount money more 0")
                }
            }else{
                console.error('This index does not exist')
            }


        } else {
            console.error('Please, create Casino')
        }

    }

    addMoneyToCasino(sumOfMoney){ //ADD MONEY TO CASINO
        if (sumOfMoney > 0) { // check if SuperAdmin balance less top-up
            for (let elem of this.casinoGetter.gameMachinesGetter) {
                elem.addMoneyGameMachine(sumOfMoney / this.casinoGetter.gameMachinesGetter.length)
            }
        } else {
            for (let elem of this.casinoGetter.gameMachinesGetter) {
                elem.addMoneyGameMachine(0)
            }
        }
    }

    deleteGameMachine(index){ // DELETE GAME MACHINE
        if(this.casinoGetter){ // check if Casino exist
            let isIndex = IsIndexInGameMachine(this.casinoGetter.gameMachinesGetter, index)
            if(isIndex) { // check if Game Machine exist
                let {money} = this.casinoGetter.gameMachinesGetter[index]
                this.casinoGetter.gameMachinesGetter.splice(index, 1)
                this.addMoneyToCasino(money)
            }else{
                console.error('This index does not exist')
            }
        }else{
            console.error('Please, create Casino or GameMachine')
        }

    }


}

// Casino
class Casino {
    constructor(name) {
        this.name = name
        this._gameMachines = [];
    }
    get gameMachinesGetter(){
        return this._gameMachines
    }
    set gameMachinesSetter(value){
        this._gameMachines.push(value)
    }
    createGameMachineInCasino(money) { // CREATE GAME IN CASINO
        this.gameMachinesSetter = new GameMachine(money)
    }


    get checkAllMoneyInMachines() { // METHOD CHECK MONEY IN ALL MACHINES
        let sum = 0
        this.gameMachinesGetter.forEach(machine => sum += machine.machineGetterMoney)
        return sum
    }
    get checkAllCountMachines(){ // METHOD CHECK COUNT ALL MACHINES
        return this.gameMachinesGetter.length
    }
}

// GameMachine
class GameMachine {
    constructor(money) {
        this.money = money
    }
    get machineGetterMoney(){
        return this.money
    }
    withdrawMoney(money) { // WITHDRAW MONEY
        if(this.money > money){
            this.money -= money
            return `${money}`
        }else if(this.money === 0){
            return false
        }else if(this.money <= money){
            let value = this.money
            this.money = 0
            return `${value}`
        }
    }
    addMoneyGameMachine(money){ // METHOD THAT ADD MONEY TO MACHINE
        this.money = this.money + money;
    }

    playGameMachine(num){ // PLAY MACHINE
        let valueGameMachine =  playGameFunc();
        if(valueGameMachine.coefGameMachine){
            this.money -= num
            let winValue = num * valueGameMachine.coefGameMachine
            console.info(`LUCKY NUMBER - ${valueGameMachine.numLucky} YOU WINNER`)
            return winValue

        }else{
            this.addMoneyGameMachine(num)
            console.error(` NUMBER - ${valueGameMachine.numLucky} YOU LOST`)
            return 0

        }

    }
}


// EXAMPLE Please uncomment
// const admin = new SuperAdmin( 15000);
// admin.createCasino("Favbet");
// admin.createGameMachine(5000)
// admin.createGameMachine(4000)
// admin.createGameMachine(5000)
// admin.addMoneyToCasino(1000)
// admin.addMoneyToGameMachine(1000,0)
// admin.takeMoneyFromCasino(1000)
// const user = new User('Oleksandr', 0)
// admin.playGame(300, admin, 0)
// user.playGame(0, admin, 0 )
//
// // CHECK
// console.debug(admin);
// console.debug(admin.casinoGetter)
// console.debug(user)




