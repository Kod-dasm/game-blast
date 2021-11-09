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
            needScore: 1000,
            time: 100,
            currentTimer: 0,
            timer: null,
            gameStart: false,
            win: false,
            lost: false,
            countUpdateField: 3,
            pause: false,
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
                cells.push({ color: this.addRandomColor(), active: false, mistake: false })
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
            this.poly[index].push({ color: this.addRandomColor(), active: false, mistake: false })
        },
        burnStars() {
            setTimeout(()=>{
                this.poly = this.poly.map(itemX => itemX.filter(itemY => !itemY.active ? true : false))
                this.recoverPoly()
            }, 200)
        },
        removeStars(item, coordX, coordY) {
            this.searchInWidth(item.color, coordX, coordY)
            if (this.polyDel.length >= this.minStar) {
                this.burnStars()
                this.score += this.countingScore(this.polyDel.length)
                if (this.score >= this.needScore) {
                    this.win = true
                    this.stopTimer()
                }
            }
            else {
                this.poly[coordX][coordY].mistake = true
                this.poly = this.poly.map(itemX => itemX.map(itemY => {
                        if (itemY.active) {
                            itemY.active = false
                            return itemY
                        }
                        return itemY
                        
                }))
                setTimeout(()=>{
                    this.poly[coordX][coordY].mistake = false
                }, 300)
            }
            this.polyDel = []
        },
        searchInWidth(color, coordX, coordY) {
            this.poly[coordX][coordY].active = true
            this.polyDel.push({ x: coordX, y: coordY })
            if (coordY + 1 < this.sizePolyY && color == this.poly[coordX][coordY + 1].color && !this.poly[coordX][coordY + 1].active) {
                this.searchInWidth(color, coordX, coordY + 1)
            }
            if (coordX - 1 >= 0 && color == this.poly[coordX - 1][coordY].color && !this.poly[coordX - 1][coordY].active) {
                this.searchInWidth(color, coordX - 1, coordY)
            }
            if (coordY - 1 >= 0 && color == this.poly[coordX][coordY - 1].color && !this.poly[coordX][coordY - 1].active) {
                this.searchInWidth(color, coordX, coordY - 1)
            }
            if (coordX + 1 < this.sizePolyX && color == this.poly[coordX + 1][coordY].color && !this.poly[coordX + 1][coordY].active) {
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
            if (this.countUpdateField > 0 && this.gameStart && !this.pause && !this.win && !this.lost) {
                this.poly = []
                this.createdPoly()
                this.countUpdateField--
            } 
            // else {

            // }
        },
        startNewGame() {
            this.stopTimer()
            this.currentTimer = this.time
            this.poly = []
            this.score = 0
            this.countUpdateField = 3
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
    },
    computed: {
        showPoly() {
            console.log(this.poly)
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
        showCurrentTimer() {
            return this.currentTimer
        },
        showCountUpdateField() {
            return this.countUpdateField
        },
    },
    created: function() {
        this.createdPoly()
    },
    destroyed: function() {
        this.stopTimer()
    },
}