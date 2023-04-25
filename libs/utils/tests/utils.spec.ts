import { uuid } from '../src'

describe('Utils', () => {

	describe('uuid', () => {
		it('should return string', () => {
			const result = uuid()
			expect(result).toBeDefined()
			expect(result.length).toEqual(36)
		})
	})

})
