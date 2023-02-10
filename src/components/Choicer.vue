<template>
    <div>
    	<div :style="{ width : width+'px', height : height+'px' }" id="paper" ref="paper"></div>

        <div class="controls">
            <button @click="isAuto = ! isAuto">Auto</button>
            <p v-if="isAuto">Size / Border Radius</p>
            <input v-if="isAuto" type="text" v-model="radiusratio">
            <button v-if="isAuto" @click="autoRun">Run</button>
        </div>

    </div>
</template>

<script>

import Raphael from 'raphael'

const BASKETHEIGHTRATIO = .7
const BASKETWIDTHRATIO = .5
const BASKETOPACITY = .8
const BORDERWIDTH = 3
const COUNTERMARGIN = 5
const COUNTERSIZE = 20
const ANIMDURATION = 300
const LEGENDSIZE = [ 60, 60 ]
const LEGENDMARGIN = 10
const ANIMATIONSLEEP = 60

export default {

	components : {
	},

    props : {
        // [ rounding (0 ... 1), color (optional) ]
        pieces : { type : Array, default : [[ .5, 'lightgreen' ]] },
        sizemin : { type : Number, default : 30 },
        sizemax : { type : Number, default : 60 },
        brightness : { type : Number, default : 1 },
        width : { type : Number, default : 300 },
        height: { type : Number, default : 300 }
    },

    data : function() {
        return {
      		paper : null,
            pool : null,
            baskets : [],
      		startX : 0,
      		startY : 0,
            actrect : null,
            debug : false,
            isAuto : false,
            radiusratio : ''
        }
    },

    mounted : function() {
    	this.init()
    },

    methods : {

    	init() {
			// create paper
	    	this.paper = Raphael(this.$refs.paper, this.width, this.height)
            // rectangles
            const upperHeight =  BASKETHEIGHTRATIO * this.paper.height
            const lowerHeight = this.paper.height - upperHeight
            // background rectangles
	    	this.pool = this.paper.rect(0,0,this.paper.width,upperHeight).attr('stroke-width',BORDERWIDTH)
            // 
            this.baskets.push(this.paper.rect(0,upperHeight, BASKETWIDTHRATIO * this.paper.width, lowerHeight)
                .attr('fill','lightblue')
                .attr('fill-opacity',BASKETOPACITY)
                .attr('stroke-width',BORDERWIDTH)
                .data('counter',0)
                .data('pos',{ x : COUNTERMARGIN, y : COUNTERMARGIN}))
            this.baskets.push(this.paper.rect( BASKETWIDTHRATIO * this.paper.width,upperHeight, BASKETWIDTHRATIO * this.paper.width, lowerHeight)
                .attr('fill','lightyellow')
                .attr('fill-opacity',BASKETOPACITY)
                .attr('stroke-width',BORDERWIDTH)
                .data('counter',0)
                .data('pos',{ x : COUNTERMARGIN, y : COUNTERMARGIN}))
            // legend
            let counter = 0
            this.baskets.forEach((basket) => {
                const legendX = basket.attr('x') + basket.attr('width') - LEGENDMARGIN - LEGENDSIZE[0]
                const legendY = basket.attr('y') + basket.attr('height') - LEGENDMARGIN - LEGENDSIZE[1]
                let legend = this.paper.rect(legendX,legendY,LEGENDSIZE[0], LEGENDSIZE[0], counter++ == 0 ? 0 : LEGENDSIZE[0] / 2)
                let text = this.paper.text(legendX + LEGENDSIZE[0] / 2,legendY + LEGENDSIZE[1] / 2, '')
                    .attr('font-size',LEGENDSIZE[1] / 2)
                    .attr('fill','red')
                    .attr('cursor','pointer')
                    .attr('z-index',-100)
                    .click(() => this.emptyBasket(basket))
                basket.data('text-id',text.id)
            })
	    	// fill with pieces
	    	this.make()
    	},

    	make() {
    		this.pieces.forEach((piece) => {
                let size = this.randomSize()
                let pos = this.randomPosition(size, this.pool)
                let color = piece[1] || Raphael.getColor(this.brightness)
                let rounding = this.calcRounding(piece[0],size)
    			this.paper.rect(pos.x,pos.y,size.w,size.h,rounding)
    				.attr('fill',color)
                    .attr('cursor','move')
                    .data('size', size)
                    .data('pos', pos)
                    .data('type', 'piece')
                    .data('borderradius', rounding)
    		        .drag(this.onMove, this.onStart, this.onComplete)
                    .onDragOver(this.onDraggedOver)
                if (this.debug) {
                    this.paper.text(pos.x+size.w/2,pos.y+size.h/2,piece[0])
                }
    		})
    	},

    	onStart(x, y) {
            this.actrect = this.paper.getElementByPoint(x,y)
    		this.startX = this.actrect.attr('x')
    		this.startY = this.actrect.attr('y')
    	},

    	onMove(dx, dy, x, y) {
            if (this.actrect.data('done')) {
                return
            }
            // position-difference
    		const xn = this.startX + dx
    		const yn = this.startY + dy
    		// respect boundaries
    		const w = this.actrect.attr('width')
    		const h = this.actrect.attr('height')
    		if ( xn <= 0 || yn <= 0
    			|| (xn + w) >= this.paper.width || (yn + h) >= this.paper.height) {
    			return
    		}
    		this.actrect.attr({x : xn, y : yn})
    	},

    	onComplete() {
            if ( ! this.actrect.data('done')) {
                this.resetOne(this.actrect)
            }
    		this.startX = 0
    		this.startY = 0
            this.actrect = null
    	},

        onDraggedOver(el) {
            this.baskets.forEach((basket) => {
                if (el === basket && ! this.actrect.data('done')) {
                    // remove drag-events from origina
                    const rect = this.paper.getById(this.actrect.id)
                    rect.undrag()
                    this.fillBasket(basket,rect)
                }
            })
        },

        randomPosition(size, rect) {
            let x = Math.floor(Math.random() * rect.attr('width'));
            let y = Math.floor(Math.random() * rect.attr('height'));
            // keep in rect
            if ( (x + size.w) >= rect.attr('width')) {
                x = rect.attr('width') - size.w
            }
            if ( (y + size.h) >= rect.attr('height')) {
                y = rect.attr('height') - size.h
            }
            return { x, y }
        },

        serialPosition(width, height, basket) {
            const pos = basket.data('pos')
            // cloning
            const retpos = { ...pos };
            // calc new position 
            pos.x = pos.x + width + COUNTERMARGIN
            // new line
            if (pos.x >= basket.attr('width') - width - COUNTERMARGIN) {
                pos.x = COUNTERMARGIN
                pos.y = pos.y + height + COUNTERMARGIN
            } 
            return { x : retpos.x + basket.attr('x'), y : retpos.y + basket.attr('y') }
        },

        randomSize() {
            const size = Math.floor(Math.random() * (this.sizemax - this.sizemin) + this.sizemin)
            return { w : size, h : size }
        },

        calcRounding(rounding, size) {
            return Math.floor(rounding * size.w / 2)
        },

        count(basket) {
            if (basket.data('counter') > 0) {
                this.paper.getById(basket.data('text-id')).attr('text', basket.data('counter'))
            } else {
                this.paper.getById(basket.data('text-id')).attr('text', '')
            }
        },

        resetOne(rect) {
            rect.animate({ 
                x : rect.data('pos').x, 
                y : rect.data('pos').y,
                width : rect.data('size').w,
                height : rect.data('size').h
            }, ANIMDURATION, 'ease-in')
            // out of basket?
            if (rect.data('done')) {
                rect.data('done',false)
                    .attr('cursor','move')    
            }         
        },

        fillBasket(basket, rect) {
            basket.data('counter',basket.data('counter') + 1)
            this.count(basket)
            rect.data('done',basket.id)
            rect.attr('cursor','pointer')
            this.orderBasket(basket)
            rect.click(() => {
                rect.unclick()
                this.restore(rect, basket)
            })
        },

        orderBasket(basket) {
            basket.data('pos',{ x : COUNTERMARGIN, y : COUNTERMARGIN})
            this.paper.forEach((obj) => {
                if (obj.data('done') == basket.id) {
                    const pos = this.serialPosition(COUNTERSIZE, COUNTERSIZE, basket)
                    obj.animate({ x : pos.x, y : pos.y, width : COUNTERSIZE, height : COUNTERSIZE }, ANIMDURATION, 'ease-in') 
                }
            })
        },

        restore(rect, basket) {
            //this.actrect = rect
            this.resetOne(rect)
            // adjust counter
            basket.data('counter',basket.data('counter') - 1)
            this.count(basket)
            this.orderBasket(basket)
        },

        emptyBasket(basket) {
            this.paper.forEach((rect) => {
                if (rect.data('done') == basket.id) {
                    this.restore(rect,basket)
                }
            })
            // to be sure
            basket.data('counter',0)
        },

        autoRun() {
            const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
            let i = 0
            this.paper.forEach((rect) => {
                if (rect.data('type') != 'piece' || rect.data('done')) {
                    return
                }
                let basket = this.getAutoBasket(rect)
                wait(i++ * ANIMATIONSLEEP).then(() => {
                    let basketcenter = this.getBasketcenter(basket)
                    rect.animate({ 
                        x : basketcenter.x, 
                        y : basketcenter.y,
                    }, ANIMDURATION, 'ease-in')
                    this.fillBasket(basket,rect)
                })
            })           
        },

        getBasketcenter(basket) {
            return { 
                x : basket.attr('x') + basket.attr('width') / 2,
                y : basket.attr('y') + basket.attr('height') / 2
            }
        },

        getAutoBasket(piece) {
            if ( ! this.radiusratio) {
                return this.baskets[0]
            }
            //console.log(piece.data('borderradius'))
            //console.log(piece.data('size').w)
            //console.log(piece.data('size').w/piece.data('borderradius'))
            if (piece.data('size').w / piece.data('borderradius') >= this.radiusratio) {
                return this.baskets[0]
            } else {
                return this.baskets[1]
            }
        },

    }

 }

</script>

<style scoped>
	#paper {
        margin:auto;
        width: 500px;
        height:700px;
    }
</style>