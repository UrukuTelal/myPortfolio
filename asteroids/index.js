let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const backgroundImage = new Image(canvas.width, canvas.height)
const asteroid1 = document.getElementById('asteroid1')
const asteroid2 = document.getElementById('asteroid2')
const asteroid3 = document.getElementById('asteroid3')
const asteroid4 = document.getElementById('asteroid4')
const asteroid5 = document.getElementById('asteroid5')
const asteroids = [asteroid1, asteroid2, asteroid3, asteroid4, asteroid5]
const playerShip = document.getElementById('playerShip')
const starburstOrange = document.getElementById('starburstOrange')
const starburstRed = document.getElementById('starburstRed')
const starburstWhite = document.getElementById('starburstWhite')
const starburstYellow = document.getElementById('starburstYellow')

const centerX = canvas.width / 2
const centerY = canvas.height / 2

class Player {
    constructor(x, y, radius, dx, dy, image) {
        this.x = x
        this.y = y
        this.radius = radius
        this.dx = dx
        this.dy = dy
        this.image = image
        this.mouseFollow = 0

    }

    draw() {
        c.save()
        c.beginPath()
        c.translate(
            this.x,
            this.y
        )
        c.arc(this.x, this.y, this.radius, Math.PI * 2, false)
        c.rotate(this.mouseFollow)
        c.drawImage(
            this.image,
            -this.radius,
            -this.radius,
            this.radius * 2,
            this.radius * 2
        )
        c.restore()
    }

    update() {
        this.draw()
        this.mouseFollow = Math.atan2(this.dx - this.x, -(this.dy - this.y))
    }
}

class Projectile {
    constructor(x, y, radius, image, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.image = image
        this.velocity = velocity
        this.rotation = 0
        this.starburst = Math.random() * (4 - 1) + 1
        this.starburstOrange = document.getElementById('starburstOrange')
        this.starburstRed = document.getElementById('starburstRed')
        this.starburstWhite = document.getElementById('starburstWhite')
        this.starburstYellow = document.getElementById('starburstYellow')
    }

    draw() {
        c.save()
        c.beginPath()
        c.translate(
            this.x,
            this.y
        )
        c.arc(this.x, this.y, this.radius, Math.PI * 2, false)
        c.rotate(this.rotation)
        c.drawImage(
            this.image,
            -this.radius,
            -this.radius,
            3 + this.radius * 2,
            3 + this.radius * 2
        )
        c.restore()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.rotation += (15 * Math.PI / 180)
    }
}

let starburstNum = Math.random() * (4 - 1) + 1

class Enemy {
    constructor(x, y, radius, image, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.image = image
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, Math.PI * 2, false)
        c.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y

    }
}

const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}


const particles = []

const enemies = []


let difficultyLevel = 51
function raiseDifficultyLevel() {
    //raise Difficulty over time
    setInterval(() => {
        if (difficultyLevel > 0) {
            difficultyLevel--
        } else {
            difficultyLevel = 0
        }
    }, 6000)
    return difficultyLevel;
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (66 - 6) + 6
        let x
        let y

        const imageNum = Math.floor(Math.random() * (4 - 0) + 0)
        const image = asteroids[imageNum]

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height

        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const angle = Math.atan2
            (
                centerY - y,
                centerX - x
            )
        const velocity = {
            x: Math.cos(angle) * Math.random() * 2,
            y: Math.sin(angle) * Math.random() * 2
        }

        enemies.push(new Enemy(x, y, radius, image, velocity))

    }, 1000 / player.radius * raiseDifficultyLevel())
}

const player = new Player(centerX, centerY, 50, 0, 0, playerShip)

const projectiles = []

//Rotate Ship
window.addEventListener('mousemove', (event) => {
    let x = event.clientX
    let y = event.clientY
    player.dx = x
    player.dy = y
})

//TODO: Flickering Projectiles
// class Projectile {
//     constructor(x, y, radius, color, velocity) {
//         this.x = x;
//         this.y = y;
//         this.radius = radius;
//         this.color = color;
//         this.velocity = velocity;
//         this.flickerInterval = Math.random() * 500 + 300; // Flicker every 300 to 800 ms
//         this.lastFlickerTime = Date.now();
//     }

//     update() {
//         this.x += this.velocity.x;
//         this.y += this.velocity.y;

//         // Flicker color
//         if (Date.now() - this.lastFlickerTime > this.flickerInterval) {
//             this.changeColor();
//             this.lastFlickerTime = Date.now();
//         }
//     }

//     changeColor() {
//         let starburstNum = Math.floor(Math.random() * 4) + 1; // Random color
//         switch (starburstNum) {
//             case 1:
//                 this.color = starburstOrange;
//                 break;
//             case 2:
//                 this.color = starburstRed;
//                 break;
//             case 3:
//                 this.color = starburstWhite;
//                 break;
//             case 4:
//                 this.color = starburstYellow;
//                 break;
//         }
//     }

//     draw(ctx) {
//         ctx.fillStyle = this.color;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//         ctx.fill();
//     }
// }

// // Shoot Projectile
// window.addEventListener('click', (event) => {
//     player.radius -= 0.23;

//     const angle = Math.atan2(
//         event.clientY - centerY,
//         event.clientX - centerX
//     );
//     const velocity = {
//         x: Math.cos(angle) * 6,
//         y: Math.sin(angle) * 6
//     };

//     let starburstNum = Math.floor(Math.random() * 4) + 1;
//     let initialColor; // Variable to hold the initial color
//     switch (starburstNum) {
//         case 1:
//             initialColor = starburstOrange;
//             break;
//         case 2:
//             initialColor = starburstRed;
//             break;
//         case 3:
//             initialColor = starburstWhite;
//             break;
//         case 4:
//             initialColor = starburstYellow;
//             break;
//     }

//     projectiles.push(new Projectile(centerX, centerY, Math.floor(player.radius / 4), initialColor, velocity));
// });

// // In your game loop, make sure to update and draw each projectile
// function gameLoop() {
//     // ... other game logic ...

//     projectiles.forEach(projectile => {
//         projectile.update();
//         projectile.draw(ctx);
//     });

//     requestAnimationFrame(gameLoop);
// }


let starburst = starburstWhite

//Shoot Projectile
window.addEventListener('click', (event) => {

    player.radius -= 0.23

    const angle = Math.atan2
        (
            event.clientY - centerY,
            event.clientX - centerX
        )
    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6
    }

    let starburstNum = Math.floor(Math.random() * (4 - 1) + 1)
    switch (starburstNum) {
        case 1:
            starburst = starburstOrange
            break;
        case 2:
            starburst = starburstRed
            break;
        case 3:
            starburst = starburstWhite
            break;
        case 4:
            starburst = starburstYellow
            break;
    }

    projectiles.push(new Projectile(centerX, centerY, Math.floor(player.radius / 4), starburst,
        velocity)
    )
})

function clearCanvas() {
    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height)


}

const times = [];
let fps

function FPS() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;

    });


    c.save()
    c.globalAlpha = 1
    c.font = '10px Arial'
    c.fillStyle = 'yellow'
    c.fillText("FPS: " + fps, 15, 15)
    c.restore()

}

let score = 0
function DrawScore(score) {

    c.font = '18px Arial'
    c.fillStyle = 'white'
    c.fillText("Score: " + score, 2, 30)

}

spawnEnemies()
setInterval(() => {
    spawnEnemies()
}, 60000 / player.radius * raiseDifficultyLevel())
setInterval(() => {
    spawnEnemies()
}, 120000 / player.radius * raiseDifficultyLevel())


let animationFrameID

// Start the first frame request
window.requestAnimationFrame(gameLoop);
function gameLoop() {
    //window.requestAnimationFrame(gameLoop)
    animationFrameID = window.requestAnimationFrame(gameLoop)
    clearCanvas()

    //Game Over test
    if (player.radius > 2) {
        player.update()
    } else { cancelAnimationFrame(animationFrameID) }

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update()
        player.update()
        //remove projectiles from edges
        if (projectile.x + projectile.radius < 0 || projectile.x + projectile.radius > canvas.width
            || projectile.y + projectile.radius < 0 || projectile.y + projectile.radius > canvas.height) {

            projectiles.splice(projectileIndex, 1)

        }
    })



    particles.forEach((particle, particalIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particalIndex)
        } else {
            particle.update()
        }

    })

    enemies.forEach((enemy, index) => {
        let initialRadius = enemy.radius
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        if (dist - enemy.radius - player.radius < 1) {

            //Explosions
            for (let i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(enemy.x, enemy.y,
                    Math.random() * 2,
                    `hsl(${Math.random() * 360}, 50%, 50%)`,
                    {
                        x: (Math.random() - 0.5) * (Math.random() * enemy.radius),
                        y: (Math.random() - 0.5) * (Math.random() * enemy.radius)
                    }
                ))

            }
            for (let i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(enemy.x, enemy.y,
                    Math.random() * 2,
                    'white',
                    {
                        x: (Math.random() - 0.5) * (Math.random() * enemy.radius),
                        y: (Math.random() - 0.5) * (Math.random() * enemy.radius)
                    }
                ))

            }
            for (let i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(enemy.x, enemy.y,
                    Math.random() * 2,
                    'yellow',
                    {
                        x: (Math.random() - 0.5) * (Math.random() * enemy.radius),
                        y: (Math.random() - 0.5) * (Math.random() * enemy.radius)
                    }
                ))

            }
            for (let i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(enemy.x, enemy.y,
                    Math.random() * 2,
                    'orange',
                    {
                        x: (Math.random() - 0.5) * (Math.random() * enemy.radius),
                        y: (Math.random() - 0.5) * (Math.random() * enemy.radius)
                    }
                ))

            }
            //lose hitpoints (ie radius)
            gsap.to(player, {
                radius: player.radius - (enemy.radius / 3)
            })
            enemies.splice(index, 1)
        }



        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            const playerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
            //When projectiles touch enemies
            if (dist - enemy.radius - projectile.radius < 1) {

                //increase score
                score += Math.round(initialRadius + (playerDist - player.radius / 10))
                if (player.radius < 50) {
                    player.radius += 0.5
                }
                enemy.color = `hsl(${Math.random() * 360}, 50%, 50%)`

                //Explosions
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y,
                        Math.random() * 2,
                        `hsl(${Math.random() * 360}, 50%, 50%)`,
                        {
                            x: (Math.random() - 0.5) * (Math.random() * enemy.radius / 2),
                            y: (Math.random() - 0.5) * (Math.random() * enemy.radius / 2)
                        }
                    ))

                }

                //and more Explosions!
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y,
                        Math.random() * 2,
                        'white',
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5)
                        }
                    ))

                }
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y,
                        Math.random() * 2,
                        'yellow',
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5)
                        }
                    ))

                }
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y,
                        Math.random() * 2,
                        'orange',
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5)
                        }
                    ))

                }

                if (enemy.radius - 10 > 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })

                    projectiles.splice(projectileIndex, 1)


                } else {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                    if (player.radius < 50) {
                        player.radius += initialRadius / 10
                    }

                }


            }
        });
    })


    c.drawImage(backgroundImage, 0, 0)
    FPS()
    DrawScore(score)

}



//animate()
//1) get the angle, 2) put in atan2 atan(y,x), 3) get x, y velocities sin(angle) cos(angle)