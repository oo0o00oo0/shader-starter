import { Group, Mesh, IcosahedronBufferGeometry } from "three"

const group = new Group()
let backdrop
let material

async function generate() {
   if (backdrop) {
      group.remove(backdrop)
   }
   backdrop = new Mesh(new IcosahedronBufferGeometry(20, 4), material)
   group.add(backdrop)
}

const obj = {
   init: async m => {
      material = m
      await generate()
   },
   update: () => {},
   group,
   generate,
   params: gui => {}
}

export { obj }
