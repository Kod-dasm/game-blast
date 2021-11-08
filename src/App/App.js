export default {
    data() {
        return {
            activeColorRed: true,
            activeColorYellow: true,
            activeColorGreen: true
        }
    },
    methods: {
        startFlashingRed() {
            setInterval(() => {
                  this.activeColor = !this.activeColor
            }, 500);
          },
    },
    computed: {
        isRed() {
            // this.flashingRed()
            return (this.$route.name == 'Red')
        },
        flashingRed() {
            if (localStorage.curTTR <= 3) this.startFlashingRed()
        },
        isYellow() {
            return (this.$route.name == 'Yellow')
        },
        isGreen() {
            return (this.$route.name == 'Green')
        }
    }
}