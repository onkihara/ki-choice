<script setup>

    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
    //import HelloWorld from './components/HelloWorld.vue'

    import Choicer from './components/Choicer.vue'
    import SVM from './components/SVM.vue'

    import { ref } from 'vue'

    const pieces = [
        [ .5 ],
        [ .8 ],
        [ 1 ],
        [ .9 ],
        [ .6 ],
        [ .9 ],
        [ .4 ],
        [ .67 ],
        [ .8 ],
        [ .3 ],
        [ .25 ],
        [ .15 ],
        [ .75 ],
        [ .6 ],
        [ .82 ],
        [ .84 ],
        [ .95 ],
        [ .9 ],
        [ .8 ],
        [ .84 ],
    ]

    const brightness = .9

    const svmpieces = [
        { type : 2, x : 2.8, y : 9.1 },
        { type : 2, x : 3.9, y : 8.3 },
        { type : 2, x : 1.5, y : 7.0 },
        { type : 2, x : 5.2, y : 7.1 },
        { type : 2, x : 8.6, y : 8.1 },
        { type : 2, x : 6.3, y : 8.0 },
        { type : 2, x : 5.0, y : 6.0 },
        { type : 2, x : 6.5, y : 6.7 },
        { type : 2, x : 7.6, y : 6.0 },
        { type : 2, x : 6.2, y : 5.3 },
        { type : 2, x : 4.2, y : 4.5 },
        { type : 2, x : 1.3, y : 4.3 },
        { type : 2, x : 8.3, y : 3.9 },
        { type : 2, x : 1.9, y : 3.1 },
        { type : 1, x : 5.9, y : 3.0 },
        { type : 1, x : 9.2, y : 5.6 },
        { type : 1, x : 0.9, y : 5.6 },
        { type : 1, x : 2.5, y : 5.0 },
        { type : 1, x : 7.0, y : 3.9 },
        { type : 1, x : 1.1, y : 2.8 },
        { type : 1, x : 3.1, y : 3.1 },
        { type : 1, x : 0.8, y : 1.8 },
        { type : 1, x : 2.0, y : 0.9 },
        { type : 1, x : 4.0, y : 2.0 },
        { type : 1, x : 4.9, y : 1.0 },
        { type : 1, x : 7.0, y : 1.0 },
        { type : 1, x : 8.3, y : 2.3 },
    ]

    let isChoice = ref(true)
    let isSVM = ref(false)

    function show(toshow) {
        if (toshow == 'choice') {
            isChoice.value = true;
            isSVM.value = false;
        }
        if (toshow == 'svm') {
            isChoice.value = false;
            isSVM.value = true;
        }
    }
 
</script>

<template>

    <choicer v-if="isChoice" :pieces="pieces" :brightness="brightness" :width="500" :height="500"></choicer>

    <SVM v-if="isSVM" :pieces="svmpieces" :brightness="brightness"  :width="500" :height="500"></SVM>

    <div id="buttons">
        <button :class="{ active : isChoice }" @click="show('choice')">Choice</button>
        <button :class="{ active : isSVM }" @click="show('svm')">SVM</button>
    </div>

</template>

<style scss>

    #buttons {
        text-align:center;
        margin-top:20px;

        button {
            margin: 0 10px;
            padding: 10px;
            background-color:lightgrey;

            &.active {
                background-color:lightblue;
            }
        }
    }

    .controls {
        display:flex;
        height:50px;
        align-items:center;
        justify-content:center;
        font-family: helvetica, sans-serif;

        button {
            margin: 0 20px;
        }

        p {
            margin-right: 10px;
        }

        input {
            width: 50px;
            text-align:center;
        }
    }


</style>
