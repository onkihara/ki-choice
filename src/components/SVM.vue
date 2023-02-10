<template>
    <div>
    	<div :style="{ width : width+'px', height : height+'px' }" id="svmpaper" ref="svmpaper"></div>

        <div class="controls">
            <button @click="makeRuler">+ Add Ruler</button>
            <button @click="clearRulers">Clear</button>
        </div>
    </div>
</template>

<script>

import Raphael from 'raphael'

const BORDERWIDTH = 3
const ANIMDURATION = 300
const POOLMARGIN = 25
const GRIDOPACITY = .2
const GRIDFONTSIZE = 12
const PIECESIZE = 15
const DRAGGERHEIGHT = .5
const DRAGGERSIZE = 15

export default {

	components : {
	},

    props : {
        // [ rounding (0 ... 1), color (optional) ]
        pieces : { type : Array, default : [] },
        brightness : { type : Number, default : 1 },
        width : { type : Number, default : 300 },
        height: { type : Number, default : 300 },
        draggerColor : { type : String, default : '' }
    },

    data : function() {
        return {
      		svmpaper : null,
            svmpool : null,
            debug : false,
            dist : 0,
            x : 0,
            y : 0,
            x1 : 0,
            y1 : 0,
            draggers : [], // { id : 0, left : leftDragger, right : rightDragger, line : line, color : color}
            startx : 0,
            starty : 0,
            actmoving : null,
        }
    },

    mounted : function() {
    	this.init()
    },

    methods : {

    	init() {
			// create svmpaper
	    	this.svmpaper = Raphael(this.$refs.svmpaper, this.width, this.height)           
            // background rectangle
	    	this.svmpool = this.svmpaper.rect(POOLMARGIN,POOLMARGIN,this.svmpaper.width-(POOLMARGIN*2),this.svmpaper.height-POOLMARGIN*2).attr('stroke-width',BORDERWIDTH)
            // pool coordinates
            this.x = this.svmpool.attr('x')
            this.y = this.svmpool.attr('y')
            this.x1 = this.x + this.svmpool.attr('width')
            this.y1 = this.y + this.svmpool.attr('height')
            this.dist = this.svmpool.attr('width')/10
            // make grid
            this.makeGrid()
	    	// fill with pieces
	    	this.makePieces()
    	},

    	makePieces() {
    		this.pieces.forEach((piece) => {
                if (piece.type == 1) {
                    this.svmpaper.circle(this.calcPosX(piece.x), this.calcPosY(piece.y), PIECESIZE)
                        .attr('fill','lightgreen')
                }
                if (piece.type == 2) {
                    this.svmpaper.rect(this.calcPosX(piece.x)-PIECESIZE, this.calcPosY(piece.y)-PIECESIZE, PIECESIZE*2, PIECESIZE*2 )
                        .attr('fill','CC0000')
                }
        	})
    	},

        makeGrid() {
            // raster
            for (let i=1;i<10;i++) {
                this.svmpaper.path("M"+this.x+","+(this.y+i*this.dist)+"H"+(this.x1)).attr('opacity',GRIDOPACITY)
                this.svmpaper.path("M"+(this.y+i*this.dist)+","+this.x+"V"+(this.y1)).attr('opacity',GRIDOPACITY)
            }
            // beschriftung
            for (let i=0;i<=10;i++) {
                this.svmpaper.text(5, this.y+i*this.dist, 10-i).attr('font-size',GRIDFONTSIZE);
                this.svmpaper.text(this.x+i*this.dist, this.y1+20, i).attr('font-size',GRIDFONTSIZE);
            }
        },

        makeRuler() {
            // dragger
            let id = this.draggers.length
            let color = this.draggerColor || Raphael.getColor(this.brightness)
            let leftDragger = this.svmpaper.rect(this.calcPosX(-0.5),this.calcPosY(DRAGGERHEIGHT),DRAGGERSIZE,DRAGGERSIZE)
                .data('id',id)
                .attr('fill',color)
                .drag(this.onMove, this.onStart, this.onComplete)
            let rightDragger = this.svmpaper.rect(this.calcPosX(10.2),this.calcPosY(DRAGGERHEIGHT),DRAGGERSIZE,DRAGGERSIZE)
                .data('id',id)
                .attr('fill',color)
                .drag(this.onMove, this.onStart, this.onComplete)
            this.draggers.push({
                id : id,
                left : leftDragger,
                right : rightDragger,
                line : null,
                color : color
            })
            this.drawLine(id)
        },

        clearRulers() {
            this.draggers.forEach((dragger) => {
                dragger.left.remove()
                dragger.right.remove()
                dragger.line.remove()
            })
            this.draggers.splice(0)
        },

        drawLine(id) {
            let dragger = this.draggers[id]
            // remove line if any
            if (dragger.line !== null) {
                dragger.line.remove()
            }
            let lcx = dragger.left.attr('x') + dragger.left.attr('width')
            let lcy = dragger.left.attr('y') + dragger.left.attr('height')/2
            let rcx = dragger.right.attr('x')
            let rcy = dragger.right.attr('y') + dragger.right.attr('height')/2
            dragger.line = this.svmpaper.path("M"+" "+lcx+" "+lcy+"L"+rcx+" "+rcy)
                .attr('stroke-width',3)
                .attr('stroke',dragger.color)
        },

        calcPosX(pos) {
            return this.x + pos * this.dist
        },

        calcPosY(pos) {
            return this.y1 - (pos * this.dist)
        },

        onMove(dx, dy) {
            let ay = dy + this.starty
            if (ay < 0) {
                ay = 0
            }
            if (ay > this.height - DRAGGERSIZE) {
                ay = this.height - DRAGGERSIZE
            }
            this.actmoving.attr({ x : this.startx, y : ay })
            this.drawLine(this.actmoving.data('id'))
        },

        onStart(x, y) {
            this.actmoving = this.svmpaper.getElementByPoint(x,y)
            this.startx = this.actmoving.attr('x');
            this.starty = this.actmoving.attr('y');
        },

        onComplete() {

        }
    }
 }

</script>

<style scoped>
	#svmpaper {
        margin:auto;
        width: 500px;
        height:700px;
    }
</style>