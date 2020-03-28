// Поле
var canvas = document.getElementById('game');

// Скажем, что наша змейка - двухменая
var context = canvas.getContext('2d');

// Размер клеточки на поле - 16 пикспелей
var grid = 16;

// Служебная переменная, отвечает за скорость
var count = 0;

// Сама змейка
var snake = {
    // Начальные координаты
    x: 160,
    y: 160,

    // Скорость змейки - в каждом новом кадре змейка смещается по Х и по У.
    // На старте будет двигаться по Х => скорость по У = 0
    dx: grid,
    dy: 0,

    // Тащим за собой хвост, который со старта пустой
    cells: [],

    // Начальная длина - 4 клетки
    maxCells: 4
};

// Еда
var apple = {
    // Начальные координаты
    x: 320,
    y: 320
};

// Генератор случайных чисел для размещения еды на поле
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Игровой цикл - основной процесс, внутри которого будет всё происходить
function loop() {
    // Дальше будет хитрая функция, которая замедляет скорость игры с 60
    // кадров в секунду до 15. Для этого она пропускает три кадра из четырёх,
    // то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду,
    // станет 15.
    requestAnimationFrame(loop);
    // Игровой код выполнится только один раз из четырёх, в этом и суть
    // замедления кадров, а пока переменная count меньше четырёх, код
    // выполняться не будет.
    if (++count < 4) {
        return;
    }

    // Обнуляем переменную скорости
    count = 0;

    // Очищаем игровое поле
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Двигаем змейку с нужной скроростью
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Если змейка достигла края по Х - продолжить с противоположной стороны
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // Если змейка достигла края по У - продолжить с противоположной стороны
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Голова всегда впереди => добавляем её коорды в начало массива длины змейки
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Сразу после этого удаляем последний элемент из массива змейки, потому что
    // она движется и постоянно освобождает клетки после себя
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Рисуем еду - красное яблоко
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Одно движение змейки - один новый нарисовнный квадратик
    context.fillStyle = 'green';

    // Обрабатываем каждый элемент змейки
    snake.cells.forEach(function(cell, index) {
        // Чтоб вокруг квадратиков была черная граница, делаем их меньше самой
        // клетки
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            // увеличиваем длину змейки
            snake.maxCells++;

            // Рисуем новое яблочко
            // Т.к. холст - 400х400 по 16 пикселей клетка, то всего 25 ячеек в
            // одну сторону
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        // Проверяем, не столкнулась ли змея сама с собой
        // Перебираем весь массив и смотрим, ест ли две клетки с равными кордами
        for (var i = index + 1; i < snake.cells.length; i++) {
            // Если такие клетки есть - рестарт игры
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // Задаем стартовые параметры основным переменным
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;

                // Спавним яблоко
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

// Мониторим какие клавиши жмякаются
document.addEventListener('keydown', function(e) {
    // Если змейка движется, например, влево, то второе нажатие влево даёт игнор.
    // Это сделано для того, чтобы не разворачивать весь массив со змейков на лету
    // и не усложнять код игры

    // Стрелка влево
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Стрелка вверх
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Стрелка вправо
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Стрелка вниз
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

requestAnimationFrame(loop);
// loop();
