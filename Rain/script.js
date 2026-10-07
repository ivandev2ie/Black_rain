"use strict";




const BOARD_SIZE = 10;

const WHITE = "white";
const BLACK = "black";

const EMPTY = null;





const AI_DEPTH = {
    easy: 1,
    medium: 3,
    hard: 4
};





const AI_NODE_LIMIT = {
    easy: 2000,
    medium: 18000,
    hard: 45000
};




const boardElement =
    document.getElementById("board");

const turnText =
    document.getElementById("turnText");

const whiteStatus =
    document.getElementById("whiteStatus");

const blackStatus =
    document.getElementById("blackStatus");

const whiteStatusDot =
    document.getElementById("whiteStatusDot");

const blackStatusDot =
    document.getElementById("blackStatusDot");

const moveCounter =
    document.getElementById("moveCounter");

const whiteCapturedElement =
    document.getElementById("whiteCaptured");

const blackCapturedElement =
    document.getElementById("blackCaptured");

const restartButton =
    document.getElementById("restartButton");

const surrenderButton =
    document.getElementById("surrenderButton");

const gameModal =
    document.getElementById("gameModal");

const closeModal =
    document.getElementById("closeModal");

const modalRestart =
    document.getElementById("modalRestart");

const modalTitle =
    document.getElementById("modalTitle");

const modalMessage =
    document.getElementById("modalMessage");

const gameModeLabel =
    document.getElementById("gameModeLabel");

const gameDescription =
    document.getElementById("gameDescription");

const whiteRole =
    document.getElementById("whiteRole");

const blackRole =
    document.getElementById("blackRole");

const difficultyWrapper =
    document.getElementById("difficultyWrapper");

const difficultySelect =
    document.getElementById("difficultySelect");

const modeButtons =
    document.querySelectorAll(".mode-button");




const DIRECTIONS = [

    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]

];




let board = [];

let currentPlayer = WHITE;

let selectedPiece = null;

let validMoves = [];

let moveNumber = 1;

let capturedWhite = 0;

let capturedBlack = 0;

let gameOver = false;

let gameMode = "ai";

let aiDifficulty = "medium";

let aiThinking = false;

let aiTimer = null;

let aiThinkTimer = null;

let aiNodes = 0;





let turnCaptureTarget = 0;

let turnCaptures = 0;




function initializeGame() {

    clearAiTimers();

    board = createInitialBoard();

    currentPlayer = WHITE;

    selectedPiece = null;

    validMoves = [];

    moveNumber = 1;

    capturedWhite = 0;

    capturedBlack = 0;

    gameOver = false;

    aiThinking = false;

    turnCaptureTarget = 0;

    turnCaptures = 0;

    hideModal();

    updateModeInterface();

    renderBoard();

    updateInterface();
}




function createInitialBoard() {

    const state =
        Array.from(
            { length: BOARD_SIZE },
            () =>
                Array(
                    BOARD_SIZE
                ).fill(EMPTY)
        );

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

            if (
                (row + col) % 2 !== 1
            ) {
                continue;
            }

            if (row < 4) {

                state[row][col] = {
                    color: BLACK,
                    king: false
                };

            } else if (row >= 6) {

                state[row][col] = {
                    color: WHITE,
                    king: false
                };

            }

        }

    }

    return state;
}




function renderBoard() {

    boardElement.innerHTML = "";

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

            const cell =
                document.createElement("button");

            cell.type = "button";

            cell.className =
                `cell ${
                    (row + col) % 2 === 1
                        ? "dark"
                        : "light"
                }`;

            cell.dataset.row = row;

            cell.dataset.col = col;

            cell.setAttribute(
                "aria-label",
                describeCell(row, col)
            );

            const piece =
                board[row][col];

            if (piece) {

                renderPiece(
                    cell,
                    piece
                );
            }


            if (
                selectedPiece &&
                selectedPiece.row === row &&
                selectedPiece.col === col
            ) {

                cell.classList.add(
                    "selected"
                );
            }


            const possibleMove =
                validMoves.find(
                    move =>
                        move.row === row &&
                        move.col === col
                );

            if (possibleMove) {

                cell.classList.add(
                    "valid-move"
                );

                if (
                    possibleMove.capture
                ) {

                    cell.classList.add(
                        "capture-move"
                    );
                }
            }


            const canSelect =
                piece &&
                piece.color === currentPlayer &&
                !gameOver &&
                !aiThinking &&
                (
                    gameMode === "local" ||
                    currentPlayer === WHITE
                );

            if (canSelect) {

                cell.classList.add(
                    "selectable"
                );
            }


            cell.addEventListener(
                "click",
                () =>
                    handleCellClick(
                        row,
                        col
                    )
            );


            boardElement.appendChild(
                cell
            );
        }
    }
}




function describeCell(
    row,
    col
) {

    const name =
        String.fromCharCode(
            65 + col
        ) +
        (BOARD_SIZE - row);

    const piece =
        board[row][col];

    if (!piece) {
        return `${name}, case vide`;
    }

    const color =
        piece.color === WHITE
            ? "blancs"
            : "noirs";

    return (
        `${name}, ` +
        (
            piece.king
                ? `dame ${color}`
                : `pion ${color}`
        )
    );
}


function renderPiece(
    cell,
    piece
) {

    const element =
        document.createElement("span");

    element.className =
        `piece ${
            piece.color
        }${
            piece.king
                ? " king"
                : ""
        }`;

    element.setAttribute(
        "aria-hidden",
        "true"
    );

    cell.appendChild(
        element
    );
}




function handleCellClick(
    row,
    col
) {

    if (
        gameOver ||
        aiThinking
    ) {
        return;
    }


    

    if (
        gameMode === "ai" &&
        currentPlayer === BLACK
    ) {

        return;
    }


    const selectedMove =
        selectedPiece &&
        validMoves.find(
            move =>
                move.row === row &&
                move.col === col
        );


    if (selectedMove) {

        executeHumanMove(
            selectedPiece.row,
            selectedPiece.col,
            selectedMove
        );

        return;
    }


    const piece =
        board[row][col];


    if (
        piece &&
        piece.color === currentPlayer
    ) {

        selectPiece(
            row,
            col
        );

        return;
    }


    clearSelection();

    renderBoard();
}




function selectPiece(
    row,
    col
) {

    const piece =
        board[row][col];

    if (
        !piece ||
        piece.color !== currentPlayer
    ) {

        return;
    }


    

    const moves =
        getTurnMoves(
            board,
            currentPlayer
        ).filter(
            move =>
                move.fromRow === row &&
                move.fromCol === col
        );


    if (moves.length === 0) {

        clearSelection();

        renderBoard();

        return;
    }


    turnCaptureTarget =
        getMaxCaptures(
            board,
            currentPlayer
        );

    turnCaptures = 0;

    selectedPiece = {
        row,
        col
    };

    validMoves = moves;

    renderBoard();
}




function executeHumanMove(
    fromRow,
    fromCol,
    move
) {

    const piece =
        board[fromRow][fromCol];

    if (!piece) {
        return;
    }


    if (turnCaptures === 0) {

        turnCaptureTarget =
            getMaxCaptures(
                board,
                currentPlayer
            );
    }


    board[move.row][move.col] =
        piece;

    board[fromRow][fromCol] =
        EMPTY;


    

    if (move.capture) {

        const capturedPiece =
            board[
                move.capturedRow
            ][
                move.capturedCol
            ];


        if (capturedPiece) {

            board[
                move.capturedRow
            ][
                move.capturedCol
            ] = EMPTY;


            registerCapture(
                capturedPiece.color
            );
        }
    }


    

    if (move.capture) {

        turnCaptures++;

        const remaining =
            turnCaptureTarget -
            turnCaptures;

        const nextCaptures =
            getSequenceFirstMoves(
                board,
                move.row,
                move.col,
                remaining
            );


        if (
            nextCaptures.length > 0
        ) {

            selectedPiece = {
                row: move.row,
                col: move.col
            };

            validMoves =
                nextCaptures;

            renderBoard();

            updateInterface();

            return;
        }
    }


    promoteIfNeeded(
        board,
        move.row,
        move.col
    );


    finishTurn();
}




function finishTurn() {

    moveNumber++;

    turnCaptureTarget = 0;

    turnCaptures = 0;

    clearSelection();

    switchPlayer();

    renderBoard();

    updateInterface();


    if (checkGameState()) {
        return;
    }


    

    if (
        gameMode === "ai" &&
        currentPlayer === BLACK
    ) {

        aiTimer =
            setTimeout(
                makeAIMove,
                350
            );
    }
}




function getNormalMovesFromBoard(
    state,
    row,
    col
) {

    const piece =
        state[row][col];

    if (!piece) {
        return [];
    }

    const moves = [];


    

    if (!piece.king) {

        const direction =
            piece.color === WHITE
                ? -1
                : 1;


        for (
            const dc of [-1, 1]
        ) {

            const nr =
                row + direction;

            const nc =
                col + dc;


            if (
                isInsideBoard(
                    nr,
                    nc
                ) &&
                state[nr][nc] === EMPTY
            ) {

                moves.push({
                    row: nr,
                    col: nc,
                    capture: false
                });
            }
        }


        return moves;
    }


    

    for (
        const [dr, dc] of DIRECTIONS
    ) {

        let nr =
            row + dr;

        let nc =
            col + dc;


        while (
            isInsideBoard(
                nr,
                nc
            ) &&
            state[nr][nc] === EMPTY
        ) {

            moves.push({
                row: nr,
                col: nc,
                capture: false
            });


            nr += dr;

            nc += dc;
        }
    }


    return moves;
}




function getCaptureMovesFromBoard(
    state,
    row,
    col
) {

    const piece =
        state[row][col];

    if (!piece) {
        return [];
    }


    

    if (!piece.king) {

        const captures = [];


        for (
            const [dr, dc] of DIRECTIONS
        ) {

            const middleRow =
                row + dr;

            const middleCol =
                col + dc;

            const landingRow =
                row + dr * 2;

            const landingCol =
                col + dc * 2;


            if (
                !isInsideBoard(
                    landingRow,
                    landingCol
                )
            ) {

                continue;
            }


            const middlePiece =
                state[
                    middleRow
                ]?.[
                    middleCol
                ];


            if (
                middlePiece &&
                middlePiece.color !== piece.color &&
                state[
                    landingRow
                ][
                    landingCol
                ] === EMPTY
            ) {

                captures.push({

                    row: landingRow,

                    col: landingCol,

                    capture: true,

                    capturedRow:
                        middleRow,

                    capturedCol:
                        middleCol

                });
            }
        }


        return captures;
    }


    

    const captures = [];


    for (
        const [dr, dc] of DIRECTIONS
    ) {

        let nr =
            row + dr;

        let nc =
            col + dc;

        let enemyFound =
            false;

        let enemyRow =
            -1;

        let enemyCol =
            -1;


        while (
            isInsideBoard(
                nr,
                nc
            )
        ) {

            const target =
                state[nr][nc];


            if (!target) {

                if (enemyFound) {

                    captures.push({

                        row: nr,

                        col: nc,

                        capture: true,

                        capturedRow:
                            enemyRow,

                        capturedCol:
                            enemyCol

                    });
                }

            } else {

                if (
                    target.color ===
                    piece.color
                ) {

                    break;
                }


                if (enemyFound) {

                    break;
                }


                enemyFound = true;

                enemyRow = nr;

                enemyCol = nc;
            }


            nr += dr;

            nc += dc;
        }
    }


    return captures;
}




function getAllCaptureMoves(
    state,
    color
) {

    const captures = [];


    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

            const piece =
                state[row][col];


            if (
                !piece ||
                piece.color !== color
            ) {

                continue;
            }


            const pieceCaptures =
                getCaptureMovesFromBoard(
                    state,
                    row,
                    col
                );


            for (
                const move
                of pieceCaptures
            ) {

                captures.push({

                    fromRow: row,

                    fromCol: col,

                    ...move

                });
            }
        }
    }


    return captures;
}





function getMaxCaptures(
    state,
    color
) {

    const sequences = [];

    for (
        const item
        of getPieces(
            state,
            color
        )
    ) {

        generateCaptureSequences(
            state,
            item.row,
            item.col,
            [],
            sequences
        );

    }


    let maximum = 0;

    for (
        const sequence
        of sequences
    ) {

        if (
            sequence.captures >
            maximum
        ) {

            maximum =
                sequence.captures;

        }

    }


    return maximum;
}



function getSequenceFirstMoves(
    state,
    row,
    col,
    required
) {
    if (required <= 0) {
        return [];
    }

    const sequences = [];

    generateCaptureSequences(
        state,
        row,
        col,
        [],
        sequences
    );


    const moves = [];

    const seen = new Set();


    for (
        const sequence
        of sequences
    ) {

        if (
            sequence.captures !==
            required
        ) {

            continue;

        }

        const first =
            sequence.path[0];

        const key =
            `${first.row}-` +
            `${first.col}-` +
            `${first.capturedRow}-` +
            `${first.capturedCol}`;

        if (seen.has(key)) {
            continue;
        }

        seen.add(key);

        moves.push(first);

    }


    return moves;
}



function getTurnMoves(
    state,
    color
) {

    const maxCaptures =
        getMaxCaptures(
            state,
            color
        );


    if (maxCaptures === 0) {

        const moves = [];

        for (
            const item
            of getPieces(
                state,
                color
            )
        ) {

            const normalMoves =
                getNormalMovesFromBoard(
                    state,
                    item.row,
                    item.col
                );

            for (
                const move
                of normalMoves
            ) {

                moves.push({

                    fromRow: item.row,

                    fromCol: item.col,

                    ...move

                });

            }

        }


        return moves;

    }


    const moves = [];

    for (
        const item
        of getPieces(
            state,
            color
        )
    ) {

        const firstMoves =
            getSequenceFirstMoves(
                state,
                item.row,
                item.col,
                maxCaptures
            );

        for (
            const move
            of firstMoves
        ) {

            moves.push({

                fromRow: item.row,

                fromCol: item.col,

                ...move

            });

        }

    }


    return moves;
}





function hasLegalMove(
    state,
    color
) {

    if (
        getAllCaptureMoves(
            state,
            color
        ).length > 0
    ) {

        return true;

    }


    for (
        const item
        of getPieces(
            state,
            color
        )
    ) {

        if (
            getNormalMovesFromBoard(
                state,
                item.row,
                item.col
            ).length > 0
        ) {

            return true;

        }

    }


    return false;
}




function promoteIfNeeded(
    state,
    row,
    col
) {

    const piece =
        state[row][col];

    if (
        !piece ||
        piece.king
    ) {

        return;
    }


    if (
        (
            piece.color === WHITE &&
            row === 0
        ) ||
        (
            piece.color === BLACK &&
            row === BOARD_SIZE - 1
        )
    ) {

        piece.king = true;
    }
}




function registerCapture(
    capturedColor
) {

    if (
        capturedColor === WHITE
    ) {

        capturedWhite++;

    } else {

        capturedBlack++;
    }


    updateCapturedPieces();
}




function switchPlayer() {

    currentPlayer =
        currentPlayer === WHITE
            ? BLACK
            : WHITE;
}




function getPieces(
    state,
    color
) {

    const pieces = [];


    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

            const piece =
                state[row][col];


            if (
                piece &&
                piece.color === color
            ) {

                pieces.push({
                    row,
                    col,
                    piece
                });
            }
        }
    }


    return pieces;
}




function checkGameState() {

    const pieces =
        getPieces(
            board,
            currentPlayer
        );


    if (
        pieces.length === 0
    ) {

        finishGame(

            currentPlayer === WHITE
                ? "Les noirs gagnent"
                : "Les blancs gagnent",

            "Toutes les pièces de l'adversaire ont été capturées."

        );


        return true;
    }


    if (
        !hasLegalMove(
            board,
            currentPlayer
        )
    ) {

        finishGame(

            currentPlayer === WHITE
                ? "Les noirs gagnent"
                : "Les blancs gagnent",

            "Aucun mouvement légal n'est disponible."

        );


        return true;
    }


    return false;
}




function updateInterface() {

    if (gameOver) {

        turnText.textContent =
            "Partie terminée";

    } else if (aiThinking) {

        turnText.textContent =
            "L'ordinateur réfléchit...";

    } else if (
        gameMode === "ai"
    ) {

        turnText.textContent =
            currentPlayer === WHITE
                ? "Votre tour"
                : "Tour de l'ordinateur";

    } else {

        turnText.textContent =
            currentPlayer === WHITE
                ? "Tour des blancs"
                : "Tour des noirs";
    }


    if (
        gameMode === "ai"
    ) {

        whiteStatus.textContent =
            currentPlayer === WHITE &&
            !aiThinking
                ? "Votre tour"
                : "En attente";


        blackStatus.textContent =
            aiThinking
                ? "L'ordinateur réfléchit..."
                : currentPlayer === BLACK
                    ? "Tour de l'ordinateur"
                    : "En attente";

    } else {

        whiteStatus.textContent =
            currentPlayer === WHITE
                ? "Tour des blancs"
                : "En attente";


        blackStatus.textContent =
            currentPlayer === BLACK
                ? "Tour des noirs"
                : "En attente";
    }


    if (whiteStatusDot) {

        whiteStatusDot.classList.toggle(
            "active",
            currentPlayer === WHITE &&
            !gameOver
        );
    }


    if (blackStatusDot) {

        blackStatusDot.classList.toggle(
            "active",
            currentPlayer === BLACK &&
            !gameOver
        );
    }


    moveCounter.textContent =
        String(moveNumber);


    updateCapturedPieces();
}




function updateCapturedPieces() {

    whiteCapturedElement.innerHTML =
        "";

    blackCapturedElement.innerHTML =
        "";


    

    for (
        let i = 0;
        i < capturedBlack;
        i++
    ) {

        const element =
            document.createElement("span");

        element.className =
            "captured-mini black";

        whiteCapturedElement.appendChild(
            element
        );
    }


    

    for (
        let i = 0;
        i < capturedWhite;
        i++
    ) {

        const element =
            document.createElement("span");

        element.className =
            "captured-mini white";

        blackCapturedElement.appendChild(
            element
        );
    }
}




function cloneBoard(state) {

    return state.map(
        row =>
            row.map(
                piece =>
                    piece
                        ? {
                            color: piece.color,
                            king: piece.king
                        }
                        : EMPTY
            )
    );
}




function applySingleMove(
    state,
    move,
    promote = true
) {

    const next =
        cloneBoard(state);


    const piece =
        next[
            move.fromRow
        ][
            move.fromCol
        ];


    next[
        move.fromRow
    ][
        move.fromCol
    ] = EMPTY;


    next[
        move.row
    ][
        move.col
    ] = piece;


    if (move.capture) {

        next[
            move.capturedRow
        ][
            move.capturedCol
        ] = EMPTY;
    }


    if (promote) {

        promoteIfNeeded(
            next,
            move.row,
            move.col
        );

    }


    return next;
}




function generateCaptureSequences(
    state,
    row,
    col,
    path,
    results
) {

    const captures =
        getCaptureMovesFromBoard(
            state,
            row,
            col
        );


    

    if (
        captures.length === 0
    ) {

        if (
            path.length > 0
        ) {

            const lastMove =
                path[
                    path.length - 1
                ];

            promoteIfNeeded(
                state,
                lastMove.row,
                lastMove.col
            );

            results.push({

                board: state,

                path,

                captures:
                    path.length
            });
        }


        return;
    }


    

    for (
        const capture
        of captures
    ) {

        const move = {

            fromRow: row,

            fromCol: col,

            ...capture

        };


        const next =
            applySingleMove(
                state,
                move,
                false
            );


        generateCaptureSequences(

            next,

            move.row,

            move.col,

            [
                ...path,
                move
            ],

            results
        );
    }
}



function getAllLegalTurnMoves(
    state,
    color
) {

    const maxCaptures =
        getMaxCaptures(
            state,
            color
        );


    

    if (
        maxCaptures > 0
    ) {

        const sequences = [];

        for (
            const item
            of getPieces(
                state,
                color
            )
        ) {

            generateCaptureSequences(
                state,
                item.row,
                item.col,
                [],
                sequences
            );

        }


        return sequences.filter(
            sequence =>
                sequence.captures ===
                maxCaptures
        );
    }


    

    const moves = [];

    for (
        const item
        of getPieces(
            state,
            color
        )
    ) {

        const normalMoves =
            getNormalMovesFromBoard(
                state,
                item.row,
                item.col
            );

        for (
            const move
            of normalMoves
        ) {

            const fullMove = {

                fromRow: item.row,

                fromCol: item.col,

                ...move

            };

            moves.push({

                board:
                    applySingleMove(
                        state,
                        fullMove
                    ),

                path: [
                    fullMove
                ],

                captures: 0

            });

        }

    }


    return moves;
}




function evaluateBoard(
    state
) {

    let score = 0;

    let whiteCount = 0;

    let blackCount = 0;


    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

            const piece =
                state[row][col];


            if (!piece) {
                continue;
            }


            

            let value =
                piece.king
                    ? 330
                    : 100;


            

            const progress =
                piece.color === BLACK
                    ? row
                    : BOARD_SIZE - 1 - row;


            value +=
                progress *
                (
                    piece.king
                        ? 0.2
                        : 2.5
                );


            

            const centerBonus =

                Math.max(
                    0,
                    4.5 -
                    Math.abs(
                        4.5 - row
                    )
                )

                +

                Math.max(
                    0,
                    4.5 -
                    Math.abs(
                        4.5 - col
                    )
                );


            value +=
                centerBonus *
                1.8;


            if (
                piece.color === BLACK
            ) {

                score += value;

                blackCount++;

            } else {

                score -= value;

                whiteCount++;
            }
        }
    }


    if (
        whiteCount === 0
    ) {

        return 1000000;
    }


    if (
        blackCount === 0
    ) {

        return -1000000;
    }


    return score;
}




function minimax(
    state,
    depth,
    alpha,
    beta,
    player
) {

    aiNodes++;


    

    if (
        aiNodes >=
        AI_NODE_LIMIT[aiDifficulty]
    ) {

        return evaluateBoard(
            state
        );
    }


    if (
        depth === 0
    ) {

        return evaluateBoard(
            state
        );
    }


    const moves =
        getAllLegalTurnMoves(
            state,
            player
        );


    

    if (
        moves.length === 0
    ) {

        return player === BLACK
            ? -1000000
            : 1000000;
    }


    

    moves.sort(
        (a, b) =>
            b.captures -
            a.captures
    );


    

    if (
        player === BLACK
    ) {

        let best =
            -Infinity;


        for (
            const move
            of moves
        ) {

            const value =
                minimax(

                    move.board,

                    depth - 1,

                    alpha,

                    beta,

                    WHITE

                );


            best =
                Math.max(
                    best,
                    value
                );


            alpha =
                Math.max(
                    alpha,
                    best
                );


            if (
                beta <= alpha
            ) {

                break;
            }
        }


        return best;
    }


    

    let best =
        Infinity;


    for (
        const move
        of moves
    ) {

        const value =
            minimax(

                move.board,

                depth - 1,

                alpha,

                beta,

                BLACK

            );


        best =
            Math.min(
                best,
                value
            );


        beta =
            Math.min(
                beta,
                best
            );


        if (
            beta <= alpha
        ) {

            break;
        }
    }


    return best;
}




function chooseAIMove() {

    const moves =
        getAllLegalTurnMoves(
            board,
            BLACK
        );


    if (
        moves.length === 0
    ) {

        return null;
    }


    

    if (
        aiDifficulty === "easy"
    ) {

        return moves[
            Math.floor(
                Math.random() *
                moves.length
            )
        ];
    }


    const depth =
        AI_DEPTH[
            aiDifficulty
        ];


    aiNodes = 0;


    let bestScore =
        -Infinity;


    let bestMoves = [];


    

    moves.sort(
        (a, b) =>
            b.captures -
            a.captures
    );


    for (
        const move
        of moves
    ) {

        const score =
            minimax(

                move.board,

                depth - 1,

                -Infinity,

                Infinity,

                WHITE

            );


        if (
            score > bestScore
        ) {

            bestScore =
                score;

            bestMoves = [
                move
            ];

        } else if (
            Math.abs(
                score -
                bestScore
            ) < 0.001
        ) {

            bestMoves.push(
                move
            );
        }


        

        if (
            aiNodes >=
            AI_NODE_LIMIT[aiDifficulty]
        ) {

            break;
        }
    }


    

    return (
        bestMoves[
            Math.floor(
                Math.random() *
                bestMoves.length
            )
        ]
        ||
        moves[0]
    );
}




function makeAIMove() {

    if (
        gameOver ||
        gameMode !== "ai" ||
        currentPlayer !== BLACK
    ) {

        return;
    }


    aiThinking = true;

    renderBoard();

    updateInterface();


    

    aiThinkTimer =
        setTimeout(
            () => {

            aiThinkTimer = null;

            

            if (
                gameOver ||
                gameMode !== "ai" ||
                currentPlayer !== BLACK
            ) {

                return;

            }

            const result =
                chooseAIMove();


            if (!result) {

                aiThinking = false;

                checkGameState();

                return;
            }


            

            const beforeWhite =
                getPieces(
                    board,
                    WHITE
                ).length;


            const beforeBlack =
                getPieces(
                    board,
                    BLACK
                ).length;


            

            board =
                result.board;


            const afterWhite =
                getPieces(
                    board,
                    WHITE
                ).length;


            const afterBlack =
                getPieces(
                    board,
                    BLACK
                ).length;


            capturedWhite +=
                Math.max(
                    0,
                    beforeWhite -
                    afterWhite
                );


            capturedBlack +=
                Math.max(
                    0,
                    beforeBlack -
                    afterBlack
                );


            moveNumber++;


            aiThinking = false;


            currentPlayer =
                WHITE;


            clearSelection();


            renderBoard();

            updateInterface();


            checkGameState();

        },
        80
    );
}




function finishGame(
    title,
    message
) {

    gameOver = true;

    aiThinking = false;

    clearAiTimers();

    clearSelection();


    modalTitle.textContent =
        title;


    modalMessage.textContent =
        message;


    showModal();

    renderBoard();

    updateInterface();
}




function surrenderGame() {

    if (gameOver) {
        return;
    }


    if (
        gameMode === "ai"
    ) {

        finishGame(

            "Partie abandonnée",

            "Vous avez abandonné la partie. L'ordinateur remporte la partie."

        );

    } else {

        finishGame(

            "Partie abandonnée",

            currentPlayer === WHITE
                ? "Les noirs remportent la partie."
                : "Les blancs remportent la partie."

        );
    }
}




function clearSelection() {

    selectedPiece = null;

    validMoves = [];
}




function showModal() {

    gameModal.classList.remove(
        "hidden"
    );

    modalRestart.focus();

}





function requestCloseModal() {

    if (gameOver) {
        return;
    }

    hideModal();

    restartButton.focus();
}


function hideModal() {

    gameModal.classList.add(
        "hidden"
    );
}




function updateModeInterface() {

    modeButtons.forEach(
        button => {

            button.classList.toggle(

                "active",

                button.dataset.mode ===
                gameMode

            );
        }
    );


    const aiMode =
        gameMode === "ai";


    difficultyWrapper.hidden =
        !aiMode;


    gameModeLabel.textContent =
        aiMode
            ? "PARTIE CONTRE L'ORDINATEUR"
            : "PARTIE LOCALE";


    gameDescription.textContent =
        aiMode
            ? "Affrontez l'ordinateur sur un damier international 10 × 10."
            : "Affrontez un autre joueur sur un damier international 10 × 10.";


    whiteRole.textContent =
        aiMode
            ? "Vous"
            : "Joueur 1";


    blackRole.textContent =
        aiMode
            ? "Ordinateur"
            : "Joueur 2";
}




modeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const newMode =
                    button.dataset.mode;


                if (
                    newMode === gameMode
                ) {

                    return;
                }


                gameMode =
                    newMode;


                initializeGame();
            }
        );
    }
);


difficultySelect.addEventListener(
    "change",
    () => {

        aiDifficulty =
            difficultySelect.value;


        initializeGame();
    }
);


restartButton.addEventListener(
    "click",
    initializeGame
);


modalRestart.addEventListener(
    "click",
    initializeGame
);


surrenderButton.addEventListener(
    "click",
    surrenderGame
);
closeModal.addEventListener(
    "click",
    requestCloseModal
);


gameModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            gameModal
        ) {

            requestCloseModal();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            requestCloseModal();

        }

    }
);




function clearAiTimers() {

    clearTimeout(aiTimer);

    clearTimeout(aiThinkTimer);

    aiTimer = null;

    aiThinkTimer = null;
}

function isInsideBoard(
    row,
    col
) {

    return (

        row >= 0 &&

        row < BOARD_SIZE &&

        col >= 0 &&

        col < BOARD_SIZE

    );
}




initializeGame();
