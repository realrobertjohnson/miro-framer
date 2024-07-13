//import { createFrames } from "./framer";

function sortLeftRightTopBottom(items) {
  if (!items) {
    return [];
  }
  if (items.length === 0) {
    return items;
  }
  if (items.length > 0) {
    
    items.sort(function compareLeft(a, b) {
      if (a.bounds.left < b.bounds.left) {
        return -1;
      }
      if (a.bounds.left > b.bounds.left) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
    
    items.sort(function compareTops(a, b) {
      if (a.bounds.top < b.bounds.top) {
        return -1;
      }
      if (a.bounds.top > b.bounds.top) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
     return items
  }
}

/*

According to:
https://developers.miro.com/docs/web-sdk-comparison-guide#an-example---converting-sticky-notes-to-shapes

This:
   let itemWidth = item.bounds.width
   let itemHeight = item.bounds.height

Should now just be this:
   let itemWidth = item.width
   let itemHeight = item.height

Create a frame:
https://developers.miro.com/docs/websdk-reference-board#createframe


*/

//export const createFrames = async () => {
  async function createFrames (){
 let currentSelection =  await miro.board.getSelection()
 let filteredTypes = ["FRAME"]
 let filteredSelection = currentSelection.filter(item => !filteredTypes.includes(item.type))
 let filteredSortedSelection = sortLeftRightTopBottom(filteredSelection)
 let arrayOfFramesToCreate = []
 filteredSortedSelection.forEach((item, i) => {
   let childrenIds = [filteredSortedSelection.id]
   let itemWidth = item.width
   let itemHeight = item.height
   let itemX = item.x
   let itemY = item.y
   console.log("width: ", itemWidth)
   console.log("height: ", itemHeight)
   let newFrame = 
     {type:"FRAME", 
      x: itemX, 
      y: itemY,
      childrenIds: childrenIds,
      width: itemWidth,
      height: itemHeight, 
      title: `Frame ${i+1}`,
     } 
    console.log("newFrame: ",newFrame)
   arrayOfFramesToCreate.push(newFrame)
 })
  
  await miro.board.widgets.create(arrayOfFramesToCreate)
  await miro.board.widgets.bringForward(filteredSortedSelection)
  let idMappedFilteredSelection = filteredSortedSelection.map(item => item.id) 
  await miro.board.selection.selectWidgets(idMappedFilteredSelection)
}

const init = () => {
  const { board } = window.miro;
  board.ui.on("icon:click", async () => {
    createFrames();
  });
};

init();