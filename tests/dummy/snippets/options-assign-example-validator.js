validator: computedValidator('user', {
  cityName: required().assign({
    onProperty: 'city.name',
    when: 'isInCity',
    message: 'What city do you live in?'
  })
})
