<html>
<body>
  <h1>Message from {{config('app.name')}} website</h1>
  <p><strong>First name:</strong> {{$first_name}}</p>
  <p><strong>Last name:</strong> {{$last_name}}</p>
  <p><strong>Email:</strong> {{$email}}</p>
  <p><strong>Phone:</strong> {{$phone}}</p>
  <p>
    <strong>Message:<br></strong>
    {{$user_message}}
  </p>
</body>
</html>
