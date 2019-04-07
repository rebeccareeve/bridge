var config ={
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  parent: 'phaser-example',
  physics: {
      default: 'matter',
      matter: {
          gravity: {
              y: 0.8
          },
            debug: true,
            debugBodyColor: 0xffffff
        }
      },
      scene: {
        create: create
      }
};

var game = new Phaser.Game(config);

function create() {
  this.matter.world.setBounds();
  this.matter.add.mouseSpring();

  this.matter.add.rectangle(770, 490, 220, 380, {
    isStatic: true,
    chamfer: {radius: 20}
  });

  this.matter.add.rectangle(30, 490, 220, 380, {
    isStatic: true,
    chamfer: {radius: 20}
  });

  var bod = Phaser.Physics.Matter.Matter.Bodies;
  var rect1 = bod.rectangle(400, 400, 50, 50);
  this.matter.world.add(rect1);

  var rect2 = bod.rectangle(200, 200, 50, 50);
  var circle1 = bod.circle(250, 200, 25);
  var circle2 = bod.circle(150, 200, 25);

  var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
    parts: [rect2, circle1, circle2]
  });

  this.matter.add.worldConstraint(compoundBody, 200, 0.1, {
    pointA: { x: 350, y: 250},
    pointB: {x: -50, y: 0}
  });

  this.matter.add.worldConstraint(compoundBody, 200, 0.1, {
    pointA: { x: 450, y: 250},
    pointB: {x: 50, y: 0}
  });

  this.matter.world.add(compoundBody);

  //Adds a square grid of bodies. 6 in a column, 3 in a row
  var stack = this.matter.add.stack(250, 50, 6, 3, 0, 0, function (x, y) { //this.matter.add. stack or pyramid (x, y, columns, rows, columnGap, rowGap, callback)
    return Phaser.Physics.Matter.Matter.Bodies.rectangle(x, y, 50, 50, Phaser.Math.Between(20, 40));
  });

  var group = this.matter.world.nextGroup(true);
  //Create a new composite containing bodies created in the callback in a grid array
  //This function uses the body bounds to prevent overlaps.
  var chain = this.matter.add.stack(450, 100, 4, 1, 0, 0, function (x, y) {
    return Phaser.Physics.Matter.Matter.Bodies.rectangle( x - 20, y, 53, 20, {
      collisionFilter: {group: group},
      chamfer: 5,
      density: 0.005,
      frictionAir: 0.05
    });

  });
// chains all bodies in the given composite together using constraints
  this.matter.add.chain(chain, 0.3, 0, -0.3, 0, {
    stiffness: 1,
    length: 2,
    render: {
      visible: true
    }
  });

  //constrain the beginning of the bridge to a fixed point.
  this.matter.add.worldConstraint(chain.bodies[0], 2, 0.9, {
    pointA: {x: 450, y: 100},
    pointB: {x: -25, y: 0}
  });

  this.matter.add.worldConstraint(chain.bodies[chain.bodies.length - 1], 2, 0.9, {
    pointA: {x: 550, y: 100},
    pointB: {x: 25, y: 0}
  });
  //add a rectangle  to the end of a chain
  this.matter.add.joint(chain.bodies[chain.bodies.length / 2], rect1, 80, 0.1)
  var rect3 = bod.rectangle(200, 200, 50, 50);
  var circle3 = bod.circle(250, 200, 25);
  var circle4 = bod.circle(150, 200, 25);

  var compoundBody1 = Phaser.Physics.Matter.Matter.Body.create({
    parts: [rect3, circle3, circle4]
  });
  this.matter.world.add(compoundBody1);

  this.matter.add.joint(rect1, compoundBody1, 80, 0.1);
}
