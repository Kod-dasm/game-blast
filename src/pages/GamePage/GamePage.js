import PlayingFieldComponent from '../../components/PlayingFieldComponent/PlayingFieldComponent.vue'

export default {
    components: {
        PlayingFieldComponent,
    },
    data() {
        return {
            poly: [],
            polyDel: [],
            sizePolyX: 10,
            sizePolyY: 10,
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
        createdPoly() {
            for (let i = 0; i < this.sizePolyX; i++) {
                this.poly.push(this.addCell())
            }
        },
        addCell() {
            let cells = []
            for (let i = 0; i < this.sizePolyY; i++) {
                cells.push({ color: this.addRandomColor(), active: false, mistake: false, hover: false })
            }
            return cells
        },
        addRandomColor() {
            return ['blue', 'green', 'purple', 'red', 'yellow'][Math.floor(Math.random()*5)]
        },
        recoverPoly() {
            for (let x = 0; x < this.sizePolyX; x++) {
                for (let y = this.poly[x].length; y < this.sizePolyX; y++) {
                    this.addStar(x)
                }   
            }
        },
        addStar(index) {
            this.poly[index].push({ color: this.addRandomColor(), active: false, mistake: false, hover: false })
        },
        activateStars() {
            for (let i = 0; i < this.polyDel.length; i++) {
                this.poly[this.polyDel[i].x][this.polyDel[i].y].active = true
            }
        },
        burnStars() {
            setTimeout(()=>{
                this.poly = this.poly.map(itemX => itemX.filter(itemY => !itemY.active ? true : false))
                this.recoverPoly()
            }, 100)
        },
        hoverAfterRemove(coordX, coordY) {
            setTimeout(()=>{
                this.hoverStars(this.poly[coordX][coordY] ,coordX, coordY)
            }, 100)
        },
        removeStars(item, coordX, coordY) {
            if (this.activeBomb) {
                this.activeBomb = false
                this.activateStars()
                this.burnStars(coordX, coordY)
                this.hoverAfterRemove(coordX, coordY)
                this.score += this.countingScore(this.polyDel.length)
                if (this.score >= this.needScore) {
                    this.win = true
                    this.stopTimer()
                }
                return
            }
            if (this.polyDel.length >= this.minStar) {
                this.activateStars()
                this.burnStars()
                this.hoverAfterRemove(coordX, coordY)
                this.addBonuse(this.polyDel.length)
                this.score += this.countingScore(this.polyDel.length)
                if (this.score >= this.needScore) {
                    this.win = true
                    this.stopTimer()
                }
            }
            else {
                this.poly[coordX][coordY].mistake = true
                setTimeout(()=>{
                    this.poly[coordX][coordY].mistake = false
                }, 200)
            }
            this.deactivateTheZone()
            this.polyDel = []
        },
        hoverStars(item, coordX, coordY) { 
            this.polyDel = []
            !this.activeBomb ? this.searchInWidth(item.color, coordX, coordY) : this.searchDetonateZone(coordX, coordY, this.radiusBomb)
        },
        searchInWidth(color, coordX, coordY) {
            this.poly[coordX][coordY].hover = true
            this.polyDel.push({ x: coordX, y: coordY })
            if (coordY + 1 < this.sizePolyY && color == this.poly[coordX][coordY + 1].color && !this.poly[coordX][coordY + 1].hover) {
                this.searchInWidth(color, coordX, coordY + 1)
            }
            if (coordX - 1 >= 0 && color == this.poly[coordX - 1][coordY].color && !this.poly[coordX - 1][coordY].hover) {
                this.searchInWidth(color, coordX - 1, coordY)
            }
            if (coordY - 1 >= 0 && color == this.poly[coordX][coordY - 1].color && !this.poly[coordX][coordY - 1].hover) {
                this.searchInWidth(color, coordX, coordY - 1)
            }
            if (coordX + 1 < this.sizePolyX && color == this.poly[coordX + 1][coordY].color && !this.poly[coordX + 1][coordY].hover) {
                this.searchInWidth(color, coordX + 1, coordY)
            }
        },
        countingScore(count) {
            if (count >= this.minStar) {
                return count + this.countingScore(count - 1)
            }
            return 0
        },
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
        updateField() {
            // if (this.countUpdateField > 0 && this.gameStart && !this.pause && !this.win && !this.lost) {
            //     this.poly = []
            //     this.createdPoly()
            //     this.countUpdateField--
            // } 
            if (this.bonuse > 2 && this.gameStart && !this.pause && !this.win && !this.lost) {
                this.bonuse -= 3
                this.poly = []
                this.createdPoly()
            }
            // else {

            // }
        },
        startNewGame() {
            this.stopTimer()
            this.currentTimer = this.time
            this.poly = []
            this.bonuse = 0
            this.score = 0
            this.countUpdateField = 3
            this.activeBomb = false
            this.gameStart = false
            this.win = false
            this.lost = false
            this.createdPoly()
        },
        putPause() {
            if (this.gameStart && !this.win && !this.lost) {
                this.pause = !this.pause
                this.pause ? this.stopTimer() : this.startTimer()
            }
        },
        //Bonuses
        addBonuse(count) {
            count > 5 ? this.bonuse++ : false
        },
        activateBonuseBomb() {
            if (this.bonuse > 4) {
                this.bonuse -= 5
                this.activeBomb = !this.activeBomb
            }
        },
        searchDetonateZone(coordX, coordY, radius) {
            this.poly[coordX][coordY].hover = true
            this.polyDel.push({ x: coordX, y: coordY })
            if (radius < 2) {
                return
            }
            if (coordY + 1 < this.sizePolyY && !this.poly[coordX][coordY + 1].hover) {
                this.searchDetonateZone(coordX, coordY + 1, radius - 1)
            }
            if (coordX - 1 >= 0 && !this.poly[coordX - 1][coordY].hover) {
                this.searchDetonateZone(coordX - 1, coordY, radius - 1)
            }
            if (coordY - 1 >= 0 && !this.poly[coordX][coordY - 1].hover) {
                this.searchDetonateZone(coordX, coordY - 1, radius - 1)
            }
            if (coordX + 1 < this.sizePolyX && !this.poly[coordX + 1][coordY].hover) {
                this.searchDetonateZone(coordX + 1, coordY, radius - 1)
            }
        },
        deactivateTheZone(){
            for (let i = 0; i < this.polyDel.length; i++) {
                this.poly[this.polyDel[i].x][this.polyDel[i].y].hover = false
            }
        },
    },
    computed: {
        showPoly() {
            return this.poly
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
        this.createdPoly()
    },
    destroyed: function() {
        this.stopTimer()
    },
}