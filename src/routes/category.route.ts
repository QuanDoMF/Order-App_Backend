import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryListWithPagination,
  getCategoryDetail,
  getCategoryList
} from '@/controllers/category.controller'
import { pauseApiHook, requireEmployeeHook, requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
import {
  CreateCategoryBody,
  CreateCategoryBodyType,
  UpdateCategoryBody,
  UpdateCategoryBodyType,
  CategoryListRes,
  CategoryListResType,
  CategoryListWithPaginationQuery,
  CategoryListWithPaginationQueryType,
  CategoryListWithPaginationRes,
  CategoryListWithPaginationResType,
  CategoryParams,
  CategoryParamsType,
  CategoryRes,
  CategoryResType
} from '@/schemaValidations/category.schema'
import { request } from 'axios'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function categoryRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get<{
    Reply: CategoryListResType
  }>(
    '/',
    {
      schema: {
        response: {
          200: CategoryListRes
        }
      }
    },
    async (request, reply) => {
      const categories = await getCategoryList()
      reply.send({
        data: categories as CategoryListResType['data'],
        message: 'Lấy danh sách danh mục thành công!'
      })
    }
  )
  fastify.get<{
    Reply: CategoryListWithPaginationResType
    Querystring: CategoryListWithPaginationQueryType
  }>(
    '/pagination',
    {
      schema: {
        response: {
          200: CategoryListWithPaginationRes
        },
        querystring: CategoryListWithPaginationQuery
      }
    },
    async (request, reply) => {
      const { page, limit } = request.query
      const data = await getCategoryListWithPagination(page, limit)
      reply.send({
        data: {
          items: data.items as CategoryListWithPaginationResType['data']['items'],
          totalItem: data.totalItem,
          totalPage: data.totalPage,
          page: data.page,
          limit: data.limit
        },
        message: 'Lấy danh sách danh mục thành công!'
      })
    }
  )
  fastify.get<{
    Params: CategoryParamsType
    Reply: CategoryResType
  }>(
    '/:id',
    {
      schema: {
        params: CategoryParams,
        response: {
          200: CategoryRes
        }
      }
    },
    async (request, reply) => {
      const category = await getCategoryDetail(request.params.id)
      reply.send({
        data: category as CategoryResType['data'],
        message: 'Lấy thông tin danh mục thành công!'
      })
    }
  )
  fastify.post<{
    Body: CreateCategoryBodyType
    Reply: CategoryResType
  }>(
    '',
    {
      schema: {
        body: CreateCategoryBody,
        response: {
          200: CategoryRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const category = await createCategory(request.body)
      reply.send({
        data: category as CategoryResType['data'],
        message: 'Tạo danh mục thành công!'
      })
    }
  )
  fastify.put<{
    Params: CategoryParamsType
    Body: UpdateCategoryBodyType
    Reply: CategoryResType
  }>(
    '/:id',
    {
      schema: {
        params: CategoryParams,
        body: UpdateCategoryBody,
        response: {
          200: CategoryRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const category = await updateCategory(request.params.id, request.body)
      reply.send({
        data: category as CategoryResType['data'],
        message: 'Cập nhật danh mục thành công!'
      })
    }
  )
  fastify.delete<{
    Params: CategoryParamsType
    Reply: CategoryResType
  }>(
    '/:id',
    {
      schema: {
        params: CategoryParams,
        response: {
          200: CategoryRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const result = await deleteCategory(request.params.id)
      reply.send({
        data: result as CategoryResType['data'],
        message: 'Xóa danh mục thành công!'
      })
    }
  )
}
