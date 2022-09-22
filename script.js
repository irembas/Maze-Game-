window.addEventListener("load", () => maze.init());

const maze = {
    init() {
        const body = document.body;

        const header = this.generateHeader("Maze", "G. Irem Bas");
        body.appendChild(header);

        const main = this.generateMain();
        body.appendChild(main);

        const footer = this.generateFooter("© by G. Irem Bas");
        body.appendChild(footer);

        this.maze = remoteMaze;
        this.newMaze(7, 7);
    },
    generateHeader(title, subtitle) {
        const header = document.createElement("header");
        const limiter = this.elementWithClasses("div", "header limiter");

        const h1 = document.createElement("h1");
        h1.innerText = title;

        const h2 = document.createElement("h2");
        h2.innerText = subtitle;

        limiter.appendChild(h1);
        limiter.appendChild(h2);

        header.appendChild(limiter);
        return header;
    },

    generateMain() {
        const main = document.createElement("main");
        const limiter = this.elementWithClasses("div", "main limiter");

        const cellFieldSets = this.generateMazeFieldsSets();
        const controlFieldSet = this.generateControlsFieldSet();

        limiter.appendChild(cellFieldSets);
        limiter.appendChild(controlFieldSet);

        main.appendChild(limiter);

        return main;
    },

    generateFooter(text) {
        const footer = document.createElement("footer");
        const limiter = this.elementWithClasses("div", "footer limiter");

        limiter.innerText = text;
        footer.appendChild(limiter);

        return footer;
    },
    generateMazeFieldsSets() {
        const fieldSet = this.makeFieldSet("maze");
        const field = this.elementWithClasses("div", "field");
        fieldSet.appendChild(field);

        const sizeBar = this.generateSizeBar();
        fieldSet.appendChild(sizeBar);
        return fieldSet;
    },
    generateControlsFieldSet() {
        const fieldSet = this.makeFieldSet("Controls");
        const controls = this.generateControls();
        fieldSet.appendChild(controls);

        const communications = this.makeFieldSet("Communications");
        const paragraph = document.createElement("paragraph");
        paragraph.id = "communications"
        communications.appendChild(paragraph);
        
        fieldSet.appendChild(communications);

        return fieldSet;

    },
    generateControls() {
        const controls = this.elementWithClasses("div", "control-holder square-holder");
        const sizer = this.elementWithClasses("div", "square-sizer");
        controls.appendChild(sizer);

        const content = this.elementWithClasses("div", "control-content square-content");
        sizer.appendChild(content);


        const arrowUp = this.elementWithClasses("div", "directions_arrow up");
        arrowUp.addEventListener("click", () => this.mazeMove(0, -1));
        content.appendChild(this.elementWithClasses("div", "directions_spacer"))
        content.appendChild(arrowUp);
        content.appendChild(this.elementWithClasses("div", "directions_spacer"))
       
        const arrowLeft = this.elementWithClasses("div", "directions_arrow left");
        arrowLeft.addEventListener("click", () => this.mazeMove(-1, 0));
        content.appendChild(arrowLeft);
        
        const player_sympol = this.elementWithClasses("div", "directions_spacer player_sympol");
        player_sympol.addEventListener("click", () => this.solve(0,0));
        content.appendChild(player_sympol);
        //content.appendChild(this.elementWithClasses("div", "directions_spacer player_sympol"))
        
        
        const arrowRight = this.elementWithClasses("div", "directions_arrow right");
        arrowRight.addEventListener("click", () => this.mazeMove(1, 0));

        content.appendChild(arrowRight);
       
        const arrowDown = this.elementWithClasses("div", "directions_arrow down");
        arrowDown.addEventListener("click", () => this.mazeMove(0, 1));
        content.appendChild(this.elementWithClasses("div", "directions_spacer"))
        content.appendChild(arrowDown);
        content.appendChild(this.elementWithClasses("div", "directions_spacer"))

        return controls;
    
    },
    generateSizeBar() {
        const sizeBar = this.elementWithClasses("div", "sizebar");

        const small = this.generateButton("small", "btn-small");
        small.addEventListener("click", () => this.newMaze(7, 7));
        sizeBar.appendChild(small);
        
        const medium = this.generateButton("medium", "btn-medium");
        medium.addEventListener("click", () => this.newMaze(13, 13));
        sizeBar.appendChild(medium);
        
        const large = this.generateButton("large", "btn-large");
        large.addEventListener("click", () => this.newMaze(25, 25));
        sizeBar.appendChild(large);
        const huge = this.generateButton("huge","btn-huge")
        sizeBar.appendChild(huge);
        huge.addEventListener("click", ()=> this.newMaze(45,45))

        return sizeBar;
    },
    generateButton(text, id) {
        const button = this.elementWithClasses("button");
        button.type = "button";
        button.innerText = text;
        button.id = id ? id : "";

        return button;
    },
    makeFieldSet(title) {
        const fieldSet = document.createElement("fieldset")
        const legend = document.createElement("legend");
        legend.innerText = title;
        fieldSet.appendChild(legend);

        return fieldSet;
    },
    generateField(width, height) {
        const oldField = document.querySelector(".field");

        const field = this.elementWithClasses("div", "field");

        for (let row = 0; row < height; row++) {
            field.appendChild(this.generateRow(width,row))
        }

        oldField.replaceWith(field);
        document.querySelectorAll(".row>div").forEach((element) => element.style.width = 'calc(100% / '+width+')');
    },
    generateRow(width,rowIndex) {
        const row = this.elementWithClasses("div", "row");

        for (let column = 0; column < width; column++) {
            row.appendChild(this.generateCell(rowIndex,column));
        }

        return row;
    },

    generateCell(row, column) {
        const squareHolder = this.elementWithClasses("div", "square-holder");
        const squareSizer = this.elementWithClasses("div", "square-sizer");
        const cell = this.elementWithClasses("div", "cell square-content");

        cell.dataset.X = column;
        cell.dataset.Y = row;

        squareHolder.appendChild(squareSizer);
        squareSizer.appendChild(cell);

        return squareHolder;
    },

    markAsWall(x,y){
        const wallCell = document.querySelector(`[data--x='${x}'][data--y='${y}']`);
        if(wallCell) {
            wallCell.classList.remove("cell");
            wallCell.classList.add("wall");
        }
    },

    showPopUp(text){
        const popup = this.elementWithClasses("div", "popup");
        const div = document.createElement("div");
        const textdiv =document.createElement("div");
        textdiv.innerText = text;
        div.appendChild(textdiv);

        const button = this.generateButton("replay", "btn-replay");
        div.appendChild(button);
        popup.appendChild(div);
        document.body.appendChild(popup);

        button.addEventListener("click", () => this.replay());


    },

    replay(){
        this.newMaze(7,7);
        this.hidepopup();
    },

    hidepopup(){
        const popup = document.querySelector(".popup");
        popup.remove();
    },

    

    async mazeMove(dx, dy) {
        const newX = this.playerX + dx;
        const newY = this.playerY + dy;

        const decompose = await this.maze.move(dx,dy)
        const cell = decompose.code.cell
        document.getElementById("communications")
        switch (cell) {
            case 0:
                this.positionPlayer(newX, newY);
                break;
            case 2:
                this.markAsWall(newX, newY);
                break;
            case 1:
                this.positionPlayer(newX, newY);
                this.showPopUp("You Won");
                break;
            default:
                alert("Imposible value");
                //break;
        }
    },

    elementWithClasses(elementType, classNames) {
        const element = document.createElement(elementType);

        if (classNames) {

            for (const className of classNames.split(" ")) {
                element.classList.add(className)
            }
        }

        return element;
    },

    
    async newMaze(width, height) {
        this.generateField(width, height);
        maze.width = width;
        maze.height = height;
        const { playerX, playerY } = await this.maze.generate(width, height);
        this.positionPlayer(playerX, playerY);
    },

    positionPlayer(x, y){
        this.playerX = x;
        this.playerY = y;

        const oldPlayer = document.querySelector(".square-content.player_sympol");
        if (oldPlayer) {
            oldPlayer.classList.remove("player_sympol");
        }

        const playerCell = document.querySelector(`[data--x='${x}'][data--y='${y}']`)
        if(playerCell) {
            playerCell.classList.remove("cell");
            playerCell.classList.add("floor");
            playerCell.classList.add("player_sympol");

        }
        

    },
    directions: [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:-1},{dx:0,dy:1}],

    async solve(fromdx,fromdy){
        
        const oldX= this.playerX;
        const oldY = this.playerY;

        for(const i of this.directions){
            if( i.dx== -fromdx && i.dy== -fromdy){
                continue;
            }
            const newX = oldX + i.dx
            const newY= oldY + i.dy
            const cell = await this.maze.move(i.dx,i.dy)
            switch(cell.code.cell){
                case 0:
                    this.positionPlayer(newX,newY);
                    const solved =await this.solve(i.dx,i.dy);
                    if(solved){
                        return Promise.resolve(true);
                    }
                    await this.maze.move(-i.dx,-i.dy);
                    this.positionPlayer(oldX,oldY);
                    break;
                case 1:
                    this.positionPlayer(newX,newY);
                    this.showPopUp("maze solved");
                    return Promise.resolve(true);
                case 2:
                    this.markAsWall(newX,newY);
                    break;
                
            }
            Promise.resolve(false);
        }
    },
}

const  remoteMaze = {
    server : "https://www2.hs-esslingen.de/~melcher/internet-technologien/maze/",
    token : null,
    async FetchandDecode(request){
        return fetch(this.server + "?" + request).then(response =>{return response.json()})
    },
    async generate(width,height){
        const ret = await this.FetchandDecode(`request=generate&userid=gubait02&width=${width}&height=${height}`)
        this.token = ret.token
        return ret
    },
    async move(dx,dy){
        const ret = this.FetchandDecode(`request=move&token=${this.token}&dx=${dx}&dy=${dy} `)
        return ret
        
    }

}

const localMaze = {
    playerX: 1,
    playerY: 1,

    maze: [
        [2, 2, 2, 2, 2, 2, 2],
        [2, 0, 0, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 0, 0, 2],
        [2, 0, 2, 2, 2, 0, 2],
        [2, 0, 0, 1, 2, 0, 2],
        [2, 2, 2, 2, 2, 2, 2]
    ],
    async generate(width, height) {
        this.playerX = 1;
        this.playerY = 1;

        return new Promise(resolve => {
            window.setTimeout(() =>
                resolve({playerX:this.playerX, playerY:this.playerY})
            );
        });
    },

    async move(dx,dy){
        if(dx < -1 || dx > 1 || dy< -1 || dy > 1){
            alert('too big move');
        }

        const newX= this.playerX + dx;
        const newY = this.playerY + dy;
        const cell = this.maze[newY][newX];
        if( cell == 0  || cell == 1){
            this.playerX = newX;
            this.playerY = newY;
        }
        return new Promise(resolve => {
            window.setTimeout(() =>
            resolve({cell, playerX:this.playerX, playerY:this.playerY}),200
            );
        });

    },
}