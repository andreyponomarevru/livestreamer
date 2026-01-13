#!/bin/sh

# Create Rabbitmq user, virtial host and limit RAM usage
( \

  rabbitmqctl \
    wait --timeout 60 $RABBITMQ_PID_FILE ; \

  rabbitmqctl add_vhost \
    $RABBITMQ_VHOST1 ; \

  rabbitmqctl add_user \
    $RABBITMQ_USER $RABBITMQ_PASSWORD 2>/dev/null ; \

  rabbitmqctl set_user_tags \
    $RABBITMQ_USER administrator ; \

  rabbitmqctl set_permissions \
    -p $RABBITMQ_VHOST1 $RABBITMQ_USER  ".*" ".*" ".*" ; \

  rabbitmqctl set_vm_memory_high_watermark "$VM_MEMORY_HIGH_WATERMARK" ; \

  echo ; \
  echo "*** vm_memory_high_watermark set to $VM_MEMORY_HIGH_WATERMARK ***" ; \
  echo "*** Virtual Host '$RABBITMQ_VHOST1' created. ***" ; \
  echo "*** User '$RABBITMQ_USER' with password '$RABBITMQ_PASSWORD' created. ***" ; \
  echo "*** Log in the WebUI at port 15672 (example: http://localhost:15672) ***"\

) &
# $@ is used to pass arguments to the rabbitmq-server command.
# For example if you use it like this: docker run -d rabbitmq arg1 arg2,
# it will be as you run in the container rabbitmq-server arg1 arg2
rabbitmq-server $@
