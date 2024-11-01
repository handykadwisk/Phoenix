<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time Off</title>
</head>

<body>
<p>{{ $data['title'] }}</p>

@if ($data['time_off_type'])
    <div>
        {{ $data['time_off_type'] }}
    </div>
@endif

@if ($data['date'])
    <div>
        Date: 
    </div>
    @foreach ($data['date'] as $item)
        <div>
            {{ $item }}
        </div>        
    @endforeach
@endif

@if ($data['note_approver'])
    <div>
        {{ $data['note_approver'] }}
    </div>
@endif

@if ($data['url'])
    <div>
        <a href={{ $data['url'] }}>Please click here to review and approve this request</a>
    </div>    
@endif

</body>

</html>
