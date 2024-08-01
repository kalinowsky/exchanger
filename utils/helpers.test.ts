import { convertKeysToCamelCase } from "./helpers"

describe("convertKeysToCamelCase", () => {
  it("should convert snake_case keys to camelCase", () => {
    const input = { snake_case_key: "value", another_key: 123 }
    const expected = { snakeCaseKey: "value", anotherKey: 123 }
    expect(convertKeysToCamelCase(input)).toEqual(expected)
  })

  it("should handle nested objects", () => {
    const input = {
      outer_key: "outerValue",
      nested_object: {
        inner_key: "innerValue",
        another_inner_key: 456,
      },
    }
    const expected = {
      outerKey: "outerValue",
      nestedObject: {
        innerKey: "innerValue",
        anotherInnerKey: 456,
      },
    }
    expect(convertKeysToCamelCase(input)).toEqual(expected)
  })

  it("should handle arrays of objects", () => {
    const input = [{ snake_case_key: "value1" }, { another_key: "value2" }]
    const expected = [{ snakeCaseKey: "value1" }, { anotherKey: "value2" }]
    expect(convertKeysToCamelCase(input)).toEqual(expected)
  })

  it("should handle mixed nested structures", () => {
    const input = {
      level_one: {
        level_two: [{ level_three_key: "value" }, { another_level_three_key: "anotherValue" }],
      },
    }
    const expected = {
      levelOne: {
        levelTwo: [{ levelThreeKey: "value" }, { anotherLevelThreeKey: "anotherValue" }],
      },
    }
    expect(convertKeysToCamelCase(input)).toEqual(expected)
  })

  it("should return the same primitive value if not an object or array", () => {
    expect(convertKeysToCamelCase(42 as any)).toBe(42)
    expect(convertKeysToCamelCase("string" as any)).toBe("string")
    expect(convertKeysToCamelCase(null as any)).toBe(null)
    expect(convertKeysToCamelCase(undefined as any)).toBe(undefined)
  })

  it("should handle empty objects and arrays", () => {
    expect(convertKeysToCamelCase({})).toEqual({})
    expect(convertKeysToCamelCase([])).toEqual([])
  })
})
