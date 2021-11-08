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
            color: ['blue', 'green', 'purple', 'red', 'yellow'],
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
                cells.push({ color: this.color[this.addRandomColor()], active: false, mistake: false })
            }
            return cells
        },
        addRandomColor() {
            return Math.floor(Math.random()*5)
        },
        recoverPoly() {
            for (let x = 0; x < this.sizePolyX; x++) {
                for (let y = this.poly[x].length; y < this.sizePolyX; y++) {
                    this.addStar(x)
                }   
            }
        },
        addStar(index) {
            this.poly[index].push({ color: this.color[this.addRandomColor()], active: false, mistake: false })
        },
        burnStar(coordX, coordY) {
            this.poly[coordX].splice(coordY, 1)
        },
        removeStar(item, coordX, coordY) {
            // console.log(item.color, coordX, coordY)
            // console.log(this.poly[coordX][coordY].active)
            this.searchInWidth(item.color, coordX, coordY)
            console.log('PolyDel fin = ',this.polyDel)
            if (this.polyDel.length > this.minStar) {
                setTimeout(()=>{
                    this.poly = this.poly.map(itemX => itemX.filter(itemY => !itemY.active ? true : false))
                    this.recoverPoly()
                }, 200)
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
    },
    computed: {
        watchPoly() {
            console.log(this.poly)
            return this.poly
        }
    },
    created: function() {
        this.createdPoly()
    }
}