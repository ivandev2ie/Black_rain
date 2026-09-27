<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const aiResponse = document.getElementById("aiResponse");
    const aiMessage = document.getElementById("aiMessage");
    const resultsGrid = document.getElementById("resultsGrid");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    const suggestionButtons =
        document.querySelectorAll(".search-suggestions button");


    /* =========================================
       SEARCH DATABASE
    ========================================= */

    const searchDatabase = {

        background: {
            message:
                "Vous recherchez un outil permettant de supprimer automatiquement l'arrière-plan d'une image.",

            results: [
                {
                    name: "Remove.bg",
                    description:
                        "Supprime automatiquement l'arrière-plan de vos images.",
                    url: "https://www.remove.bg/"
                },
                {
                    name: "Canva",
                    description:
                        "Éditez vos images et utilisez la suppression d'arrière-plan.",
                    url: "https://www.canva.com/"
                }
            ]
        },

        logo: {
            message:
                "Vous recherchez un outil permettant de créer ou concevoir un logo.",

            results: [
                {
                    name: "Canva",
                    description:
                        "Créez facilement des logos et éléments graphiques.",
                    url: "https://www.canva.com/create/logos/"
                },
                {
                    name: "Adobe Express",
                    description:
                        "Créez rapidement des designs et logos personnalisés.",
                    url: "https://www.adobe.com/express/"
                }
            ]
        },

        pdf: {
            message:
                "Vous recherchez un outil permettant de compresser ou optimiser un fichier PDF.",

            results: [
                {
                    name: "iLovePDF",
                    description:
                        "Compressez, convertissez et éditez vos fichiers PDF.",
                    url: "https://www.ilovepdf.com/"
                },
                {
                    name: "Smallpdf",
                    description:
                        "Une suite d'outils en ligne pour vos documents PDF.",
                    url: "https://smallpdf.com/"
                }
            ]
        },

        video: {
            message:
                "Vous recherchez un outil pour créer ou modifier des vidéos.",

            results: [
                {
                    name: "CapCut",
                    description:
                        "Plateforme de création et de montage vidéo.",
                    url: "https://www.capcut.com/"
                },
                {
                    name: "Canva",
                    description:
                        "Créez des vidéos et animations directement en ligne.",
                    url: "https://www.canva.com/video-editor/"
                }
            ]
        },

        code: {
            message:
                "Vous recherchez un environnement ou un outil pour développer du logiciel.",

            results: [
                {
                    name: "GitHub",
                    description:
                        "Hébergez, gérez et collaborez sur vos projets de code.",
                    url: "https://github.com/"
                },
                {
                    name: "Stack Overflow",
                    description:
                        "Trouvez des réponses aux problèmes de programmation.",
                    url: "https://stackoverflow.com/"
                }
            ]
        },

        generic: {
            message:
                "J'ai analysé votre demande. Voici quelques outils qui pourraient correspondre à votre recherche.",

            results: [
                {
                    name: "Canva",
                    description:
                        "Une plateforme polyvalente pour créer différents contenus.",
                    url: "https://www.canva.com/"
                },
                {
                    name: "Google",
                    description:
                        "Recherchez rapidement des ressources et services sur le web.",
                    url: "https://www.google.com/"
                }
            ]
        }

    };


    /* =========================================
       DETECT SEARCH TYPE
    ========================================= */

    function detectSearch(query) {

        const text = query.toLowerCase();

        if (
            text.includes("background") ||
            text.includes("arrière-plan") ||
            text.includes("fond") ||
            text.includes("photo")
        ) {
            return searchDatabase.background;
        }

        if (
            text.includes("logo") ||
            text.includes("design")
        ) {
            return searchDatabase.logo;
        }

        if (
            text.includes("pdf") ||
            text.includes("document") ||
            text.includes("compresser")
        ) {
            return searchDatabase.pdf;
        }

        if (
            text.includes("vidéo") ||
            text.includes("video") ||
            text.includes("montage")
        ) {
            return searchDatabase.video;
        }

        if (
            text.includes("code") ||
            text.includes("programmer") ||
            text.includes("développer") ||
            text.includes("developer")
        ) {
            return searchDatabase.code;
        }

        return searchDatabase.generic;
    }


    /* =========================================
       PERFORM SEARCH
    ========================================= */

    function performSearch() {

        const query = searchInput.value.trim();

        if (!query) {

            searchInput.focus();

            searchInput.style.borderBottom =
                "1px solid rgba(255,0,0,0.5)";

            setTimeout(() => {
                searchInput.style.borderBottom = "none";
            }, 700);

            return;
        }


        /* Loading state */

        aiResponse.classList.add("visible");

        aiMessage.textContent =
            "Analyse de votre demande en cours...";

        resultsGrid.innerHTML = `
            <div class="tool-card">
                <div class="tool-number">...</div>

                <div class="tool-info">
                    <h3>Analyse</h3>
                    <p>Recherche des outils correspondants...</p>
                </div>
            </div>
        `;


        /* Simulate AI processing */

        setTimeout(() => {

            const result = detectSearch(query);

            aiMessage.textContent = result.message;

            resultsGrid.innerHTML = "";

            result.results.forEach((item, index) => {

                const card = document.createElement("div");

                card.className = "tool-card";

                card.innerHTML = `
                    <div class="tool-number">
                        ${String(index + 1).padStart(2, "0")}
                    </div>

                    <div class="tool-info">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>

                    <a
                        href="${item.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="tool-link"
                    >
                        Ouvrir
                        <span>↗</span>
                    </a>
                `;

                resultsGrid.appendChild(card);

            });

            aiResponse.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 900);
    }


    /* =========================================
       SEARCH BUTTON
    ========================================= */

    searchButton.addEventListener("click", performSearch);


    /* =========================================
       ENTER KEY
    ========================================= */

    searchInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            performSearch();
        }

    });


    /* =========================================
       SUGGESTIONS
    ========================================= */

    suggestionButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const query = button.dataset.query;

            searchInput.value = query;

            performSearch();

        });

    });


    /* =========================================
       MOBILE MENU
    ========================================= */

    mobileMenuBtn.addEventListener("click", () => {

        mobileMenu.classList.toggle("open");

    });


    /* =========================================
       CLOSE MOBILE MENU
    ========================================= */

    document.querySelectorAll(".mobile-menu a").forEach((link) => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");

        });

    });


    /* =========================================
       NAVBAR SCROLL EFFECT
    ========================================= */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.style.background =
                "rgba(2, 4, 3, 0.75)";

            navbar.style.backdropFilter =
                "blur(12px)";

        } else {

            navbar.style.background = "transparent";

            navbar.style.backdropFilter = "none";

        }

    });


    /* =========================================
       START BUTTONS
    ========================================= */

    document.querySelectorAll(".start-btn").forEach((button) => {

        button.addEventListener("click", () => {

            document
                .getElementById("home")
                .scrollIntoView({
                    behavior: "smooth"
                });

            setTimeout(() => {
                searchInput.focus();
            }, 600);

        });

    });


    /* =========================================
       CATEGORY BUTTONS
    ========================================= */

    document.querySelectorAll(".category-list button")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const category =
                    button.querySelector("strong").textContent;

                searchInput.value =
                    `Je cherche des outils de ${category}`;

                document
                    .getElementById("home")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                setTimeout(() => {
                    performSearch();
                }, 700);

            });

        });

});
=======
"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const BOARD_SIZE = 10;

const WHITE = "white";
const BLACK = "black";

const EMPTY = null;


/*
    Profondeur de recherche de l'IA.
*/

const AI_DEPTH = {
    easy: 1,
    medium: 3,
    hard: 4
};


/*
    Limite de calcul pour éviter que
    le navigateur reste bloqué trop longtemps.
*/

const AI_NODE_LIMIT = {
    easy: 2000,
    medium: 18000,
    hard: 45000
};


/* =========================================================
   DOM
========================================================= */

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


/* =========================================================
   DIRECTIONS
========================================================= */

const DIRECTIONS = [

    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]

];


/* =========================================================
   ÉTAT DU JEU
========================================================= */

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


/*
    Objectif de la série de prises en cours
    (règle de la prise maximale).
*/

let turnCaptureTarget = 0;

let turnCaptures = 0;


/* =========================================================
   INITIALISATION
========================================================= */

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


/* =========================================================
   CRÉATION DU DAMIER
========================================================= */

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


/* =========================================================
   AFFICHAGE DU DAMIER
========================================================= */

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


/* =========================================================
   AFFICHAGE D'UNE PIÈCE
   ========================================================= */

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


/* =========================================================
   CLIC UTILISATEUR
========================================================= */

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


    /*
        En mode ordinateur,
        le joueur contrôle uniquement
        les blancs.
    */

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


/* =========================================================
   SÉLECTION D'UNE PIÈCE
========================================================= */

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


    /*
        Seuls les coups qui atteignent
        le nombre maximal de prises
        sont jouables.
    */

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


/* =========================================================
   EXÉCUTER UN COUP HUMAIN
========================================================= */

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


    /*
        Capture.
    */

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


    /*
        Promotion.

        Un pion qui traverse la dernière rangée
        pendant une série de prises doit
        terminer son coup en pion : la
        promotion n'a lieu qu'à la fin.
    */

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


/* =========================================================
   FIN DU TOUR
========================================================= */

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


    /*
        L'ordinateur joue les noirs.
    */

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


/* =========================================================
   COUPS NORMAUX
========================================================= */

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


    /*
        Pion.
    */

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


    /*
        Dame.
    */

    for (
        const [dr, dc]
        of DIRECTIONS
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


/* =========================================================
   CAPTURES
========================================================= */

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


    /*
        Pion.
    */

    if (!piece.king) {

        const captures = [];


        for (
            const [dr, dc]
            of DIRECTIONS
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


    /*
        Dame.
    */

    const captures = [];


    for (
        const [dr, dc]
        of DIRECTIONS
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


/* =========================================================
   TOUTES LES CAPTURES
========================================================= */

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
/* =========================================================
   COUPS LÉGAUX D'UN TOUR
   ========================================================= */

/*
    Nombre maximal de pièces qu'un joueur
    peut capturer en un seul tour.
*/

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


/*
    Premiers coups d'une série de prises
    partant d'une pièce, parmi les séries
    qui atteignent exactement "required"
    prises.
*/

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


/*
    Tous les coups que le joueur
    a le droit de jouer.
*/

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


/*
    Test rapide : le joueur
    a-t-il au moins un coup légal ?
*/

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


/* =========================================================
   PROMOTION
========================================================= */

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


/* =========================================================
   CAPTURES COMPTABILISÉES
========================================================= */

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


/* =========================================================
   CHANGER DE JOUEUR
========================================================= */

function switchPlayer() {

    currentPlayer =
        currentPlayer === WHITE
            ? BLACK
            : WHITE;
}


/* =========================================================
   RÉCUPÉRER LES PIÈCES
========================================================= */

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


/* =========================================================
   VÉRIFICATION FIN DE PARTIE
========================================================= */

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


/* =========================================================
   INTERFACE
========================================================= */

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
                ? "Réflexion..."
                : currentPlayer === BLACK
                    ? "À jouer"
                    : "En attente";

    } else {

        whiteStatus.textContent =
            currentPlayer === WHITE
                ? "À jouer"
                : "En attente";


        blackStatus.textContent =
            currentPlayer === BLACK
                ? "À jouer"
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


/* =========================================================
   AFFICHER LES CAPTURES
========================================================= */

function updateCapturedPieces() {

    whiteCapturedElement.innerHTML =
        "";

    blackCapturedElement.innerHTML =
        "";


    /*
        Les pièces noires capturées
        apparaissent chez les blancs.
    */

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


    /*
        Les pièces blanches capturées
        apparaissent chez les noirs.
    */

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


/* =========================================================
   IA — COPIE DU DAMIER
========================================================= */

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


/* =========================================================
   IA — APPLIQUER UN COUP
========================================================= */

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


/* =========================================================
   IA — GÉNÉRATION DES PRISES MULTIPLES
========================================================= */

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


    /*
        Plus aucune capture :
        la série est terminée. La promotion
        n'a lieu que maintenant, sur la case
        d'arrivée.
    */

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


    /*
        Continuer chaque possibilité.
    */

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


/* =========================================================
   IA — COUPS COMPLETS
========================================================= */
function getAllLegalTurnMoves(
    state,
    color
) {

    const maxCaptures =
        getMaxCaptures(
            state,
            color
        );


    /*
        Les captures sont prioritaires :
        seules les séries atteignant
        le maximum sont légales.
    */

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


    /*
        Aucun capture :
        mouvements normaux.
    */

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


/* =========================================================
   IA — ÉVALUATION
========================================================= */

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


            /*
                Valeur de base.
            */

            let value =
                piece.king
                    ? 330
                    : 100;


            /*
                Bonus d'avancement.
            */

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


            /*
                Bonus de position centrale.
            */

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


/* =========================================================
   IA — MINIMAX + ALPHA-BÊTA
========================================================= */

function minimax(
    state,
    depth,
    alpha,
    beta,
    player
) {

    aiNodes++;


    /*
        Protection contre trop de calculs.
    */

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


    /*
        Aucun mouvement :
        partie terminée.
    */

    if (
        moves.length === 0
    ) {

        return player === BLACK
            ? -1000000
            : 1000000;
    }


    /*
        On examine d'abord
        les prises.
    */

    moves.sort(
        (a, b) =>
            b.captures -
            a.captures
    );


    /*
        Maximisation pour les noirs.
    */

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


    /*
        Minimisation pour les blancs.
    */

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


/* =========================================================
   IA — CHOIX DU COUP
========================================================= */

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


    /*
        Facile :
        coup aléatoire parmi les coups légaux.
    */

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


    /*
        Les captures sont étudiées
        en premier.
    */

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


        /*
            Si la limite de calcul
            est atteinte, on arrête.
        */

        if (
            aiNodes >=
            AI_NODE_LIMIT[aiDifficulty]
        ) {

            break;
        }
    }


    /*
        Plusieurs coups peuvent avoir
        la même évaluation.
    */

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


/* =========================================================
   IA — JOUER
========================================================= */

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


    /*
        Petit délai pour que l'utilisateur
        voie que l'IA réfléchit.
    */

    aiThinkTimer =
        setTimeout(
            () => {

            aiThinkTimer = null;

            /*
                La partie a pu être relancée
                ou abandonnée pendant
                la réflexion.
            */

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


            /*
                Comptage avant/après.
            */

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


            /*
                Application du coup complet.
            */

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


/* =========================================================
   FIN DE PARTIE
========================================================= */

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


/* =========================================================
   ABANDONNER
========================================================= */

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


/* =========================================================
   SÉLECTION
========================================================= */

function clearSelection() {

    selectedPiece = null;

    validMoves = [];
}


/* =========================================================
   MODAL
   ========================================================= */

function showModal() {

    gameModal.classList.remove(
        "hidden"
    );

    modalRestart.focus();

}


/*
    Une partie terminée ne peut pas être
    refermée sans en commencer une autre.
*/

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


/* =========================================================
   MODE DE JEU
========================================================= */

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


/* =========================================================
   ÉVÉNEMENTS
========================================================= */

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


/* =========================================================
   UTILITAIRE
   ========================================================= */

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


/* =========================================================
   LANCEMENT
========================================================= */

initializeGame();
>>>>>>> a7d62cf07220dbf750d4caf68ebce5b3f71d2c2b
