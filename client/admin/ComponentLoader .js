import { ComponentLoader } from 'adminjs'
import Login from 'Login'

const componentLoader = new ComponentLoader()

const Components = {
    Login: componentLoader.add('Login', Login.join(__dirname, './my-component')),
  // add more components here...
}