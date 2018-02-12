<tr
  class="published published-{!! $node->published !!}"
  data-mediatable-type="{!! snake_case(str_plural(class_basename($node))) !!}"
  data-article-id="@if(!empty($node->id)){{$node->id}}@endif"  
>
<td>
  <i class="fa fa-circle fa-published"></i>
  <?php $route_name = 'admin.'.snake_case(str_plural(class_basename($node))).'.edit'; ?>
  {!! link_to_route($route_name, $node->title, [$node->id], ['class' => '']) !!}
</td>
<td class="attribute time">{{ $node->created_at }}</td>
</tr>
