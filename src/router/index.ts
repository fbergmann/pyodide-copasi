import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/steadyState',
          name: 'SteadyState',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('@/components/tasks/SteadyState.vue')
        },
        {
          path: '/species',
          name: 'species',
          component: () => import('@/components/model/Species.vue')
        },
        {
          path: '/compartments',
          name: 'compartments',
          component: () => import('@/components/model/Compartments.vue')
        },
        {
          path: '/parameters',
          name: 'parameters',
          component: () => import('@/components/model/Parameters.vue')
        },
        {
          path: '/reactions',
          name: 'reactions',
          component: () => import('@/components/model/Reactions.vue')
        },
        {
          path: '/events',
          name: 'events',
          component: () => import('@/components/model/Events.vue')
        }
      ]
    }
  ]
})

export default router
