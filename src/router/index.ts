import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

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
          component: () => import('@/components/Landing.vue')
        },
        {
          path: '/steadyState',
          name: 'Steady State',
          component: () => import('@/components/tasks/SteadyState.vue')
        },
        {
          path: '/timeCourse',
          name: 'Time Course',
          component: () => import('@/components/tasks/TimeCourse.vue')
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
