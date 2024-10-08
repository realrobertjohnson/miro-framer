function sortLeftRightTopBottom(items) {
  if (!items) {
    return [];
  }
  if (items.length === 0) {
    return items;
  }
  if (items.length > 0) {

    items.sort(function compareLeft(a, b) {
      const aLeft = a.x - (a.width / 2)
      const bLeft = b.x - (b.width / 2)

      if (aLeft < bLeft) {
        return -1;
      }
      if (aLeft > bLeft) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });

    items.sort(function compareTops(a, b) {
      const aTop = a.y - (a.height / 2)
      const bTop = b.y - (b.height / 2)

      if (aTop < bTop) {
        return -1;
      }
      if (aTop > bTop) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
    return items
  }
}

async function executeFramer() {
  let currentSelection = await miro.board.getSelection()

  if (currentSelection.length === 0) {
    await miro.board.notifications.showError('No objects selected. Select something and try again.')
    return
  }

  let filteredTypes = ["frame"]
  let filteredSelection = currentSelection.filter(item => !filteredTypes.includes(item.type))
  let filteredSortedSelection = sortLeftRightTopBottom(filteredSelection)
  const newFrames = []

  for (let i = 0; i < filteredSortedSelection.length; i++) {
    const item = filteredSortedSelection[i]
    let childrenIds = [item.id]
    let itemWidth = item.width
    let itemHeight = item.height
    let itemX = item.x
    let itemY = item.y
    const newFrame = await miro.board.createFrame({
      x: itemX,
      y: itemY,
      width: itemWidth,
      height: itemHeight,
      title: `Frame ${i + 1}`
    })
    await newFrame.add(item);
    await item.sendToBack();
    newFrames.push(newFrame);
  }

  await miro.board.deselect()
  await miro.board.select({ id: newFrames.map(f => f.id) })
  await miro.board.notifications.showInfo(newFrames.length + ' objects were framed')
}

async function newFramerVersion() {
  await miro.board.notifications.showError('Framer is now <a href="https://multiframe.ca" target="_blank">MultiFrame</a>!');
}

const init = () => {
  const { board } = window.miro;
  board.ui.on("icon:click", async () => {
    //executeFramer();
    newFramerVersion();
  });
};

init();