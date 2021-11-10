import PlayingFieldComponent from '../../components/PlayingFieldComponent/PlayingFieldComponent.vue'

export default {
    components: {
        PlayingFieldComponent,
    },
    data() {
        return {
            field: [],
            fieldDel: [],
            sizeFieldX: 10,
            sizeFieldY: 10,
            minStar: 2,
            score: 0,
            needScore: 1200,
            time: 120,
            currentTimer: 0,
            timer: null,
            radiusBomb: 3,

            gameStart: false,
            win: false,
            lost: false,
            pause: false,
            activeBomb: false,

            bonuse: 0,
            // countUpdateField: 3,
        }
    },
    methods: {
        //Creating a field
        createdField() {
            for (let i = 0; i < this.sizeFieldX; i++) {
                this.field.push(this.addCell())
            }
        },
        addCell() {
            let cells = []
            for (let i = 0; i < this.sizeFieldY; i++) {
                cells.push({ color: this.addRandomColor(), active: false, mistake: false, hover: false })
            }
            return cells
        },
        addRandomColor() {
            return ['blue', 'green', 'purple', 'red', 'yellow'][Math.floor(Math.random()*5)]
        },
        //Restoring the field
        recoverField() {
            for (let x = 0; x < this.sizeFieldX; x++) {
                for (let y = this.field[x].length; y < this.sizeFieldX; y++) {
                    this.addStar(x)
                }   
            }
        },
        addStar(index) {
            this.field[index].push({ color: this.addRandomColor(), active: false, mistake: false, hover: false })
        },
        //The process of burning stars
        activateStars() {
            for (let i = 0; i < this.fieldDel.length; i++) {
                this.field[this.fieldDel[i].x][this.fieldDel[i].y].active = true
            }
        },
        burnStars() {
            setTimeout(()=>{
                this.field = this.field.map(itemX => itemX.filter(itemY => !itemY.active ? true : false))
                this.recoverField()
            }, 100)
        },
        hoverAfterRemove(coordX, coordY) {
            setTimeout(()=>{
                this.hoverStars(this.field[coordX][coordY] ,coordX, coordY)
            }, 100)
        },
        countingScore(count) {
            if (count >= this.minStar) {
                return count + this.countingScore(count - 1)
            }
            return 0
        },
        checkWin() {
            if (this.score >= this.needScore) {
                this.win = true
                this.stopTimer()
            }
        },
        removalProcess(coordX, coordY) {
            this.activateStars()
            this.burnStars(coordX, coordY)
            this.hoverAfterRemove(coordX, coordY)
            this.score += this.countingScore(this.fieldDel.length)
            this.checkWin()
        },
        mistakenStar(coordX, coordY) {
            this.field[coordX][coordY].mistake = true
            setTimeout(()=>{
                this.field[coordX][coordY].mistake = false
            }, 200)
        },
        //Removing stars
        removeStars(item, coordX, coordY) {
            if (this.activeBomb) {
                this.activeBomb = false
                this.removalProcess(coordX, coordY)
                return
            }
            if (this.fieldDel.length >= this.minStar) {
                this.removalProcess(coordX, coordY)
                this.addBonuse(this.fieldDel.length)
            }
            else {
                this.mistakenStar(coordX, coordY)
            }
            this.deactivateTheZone()
            this.fieldDel = []
        },
        //Finding the width to burn stars
        hoverStars(item, coordX, coordY) { 
            this.fieldDel = []
            !this.activeBomb ? this.searchInWidth(item.color, coordX, coordY) : this.searchDetonateZone(coordX, coordY, this.radiusBomb)
        },
        saveTheStarValue(coordX, coordY) {
            this.field[coordX][coordY].hover = true
            this.fieldDel.push({ x: coordX, y: coordY })
        },
        searchInWidth(color, coordX, coordY) {
            this.saveTheStarValue(coordX, coordY)
            if (coordY + 1 < this.sizeFieldY && color == this.field[coordX][coordY + 1].color && !this.field[coordX][coordY + 1].hover) {
                this.searchInWidth(color, coordX, coordY + 1)
            }
            if (coordX - 1 >= 0 && color == this.field[coordX - 1][coordY].color && !this.field[coordX - 1][coordY].hover) {
                this.searchInWidth(color, coordX - 1, coordY)
            }
            if (coordY - 1 >= 0 && color == this.field[coordX][coordY - 1].color && !this.field[coordX][coordY - 1].hover) {
                this.searchInWidth(color, coordX, coordY - 1)
            }
            if (coordX + 1 < this.sizeFieldX && color == this.field[coordX + 1][coordY].color && !this.field[coordX + 1][coordY].hover) {
                this.searchInWidth(color, coordX + 1, coordY)
            }
        },
        searchDetonateZone(coordX, coordY, radius) {
            this.saveTheStarValue(coordX, coordY)
            if (radius < 2) {
                return
            }
            if (coordY + 1 < this.sizeFieldY && !this.field[coordX][coordY + 1].hover) {
                this.searchDetonateZone(coordX, coordY + 1, radius - 1)
            }
            if (coordX - 1 >= 0 && !this.field[coordX - 1][coordY].hover) {
                this.searchDetonateZone(coordX - 1, coordY, radius - 1)
            }
            if (coordY - 1 >= 0 && !this.field[coordX][coordY - 1].hover) {
                this.searchDetonateZone(coordX, coordY - 1, radius - 1)
            }
            if (coordX + 1 < this.sizeFieldX && !this.field[coordX + 1][coordY].hover) {
                this.searchDetonateZone(coordX + 1, coordY, radius - 1)
            }
        },
        deactivateTheZone(){
            this.field = this.field.map(itemX => itemX.map(itemY => {
                if (itemY.hover) {
                    itemY.hover = false
                }
                return itemY
            }))
        },
        //Points and Bonuses panel
        startGame() {
            if (!this.gameStart) {
                this.gameStart = true
                this.currentTimer = this.time
                this.startTimer()
            }
        },
        startTimer(){
            this.timer = setInterval(() => {
                this.currentTimer > 0 ? this.currentTimer-- : this.lost = true
            }, 1000)
        },
        stopTimer(){
            clearTimeout(this.timer)
        },
        startNewGame() {
            this.stopTimer()
            this.currentTimer = this.time
            this.field = []
            this.bonuse = 0
            this.score = 0
            this.countUpdateField = 3
            this.activeBomb = false
            this.gameStart = false
            this.win = false
            this.lost = false
            this.createdField()
        },
        putPause() {
            if (this.isGame()) {
                this.pause = !this.pause
                this.pause ? this.stopTimer() : this.startTimer()
            }
        },
        isGame() {
            return this.gameStart && !this.win && !this.lost
        },
        //Bonuses
        addBonuse(count) {
            count > 5 ? this.bonuse++ : false
        },
        activateBonuseBomb() {
            if (this.bonuse > 4 && !this.pause && this.isGame()) {
                this.bonuse -= 5
                this.activeBomb = !this.activeBomb
            }
        },
        updateField() {
            // if (this.countUpdateField > 0 && this.gameStart && !this.pause && !this.win && !this.lost) {
            //     this.field = []
            //     this.createdField()
            //     this.countUpdateField--
            // } 
            if (this.bonuse > 2 && !this.pause && this.isGame()) {
                this.bonuse -= 3
                this.field = []
                this.createdField()
            }
        },
        
    },
    computed: {
        showField() {
            return this.field
        },
        showScore() {
            return this.score
        },
        showWin() {
            return this.win
        },
        showLost() {
            return this.lost
        },
        showPause() {
            return this.pause
        },
        showBonuse() {
            return this.bonuse
        },
        showCurrentTimer() {
            return this.currentTimer
        },
        showCountUpdateField() {
            return this.countUpdateField
        },
        showBomb() {
            return this.activeBomb
        },
    },
    created: function() {
        this.createdField()
    },
    destroyed: function() {
        this.stopTimer()
    },
}